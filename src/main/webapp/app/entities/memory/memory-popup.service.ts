import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Memory } from './memory.model';
import { MemoryService } from './memory.service';

@Injectable()
export class MemoryPopupService {
    private ngbModalRef: NgbModalRef;
    memory:Memory;
    lng:number;
    lat:number
    constructor(
        private datePipe: DatePipe,
        private modalService: NgbModal,
        private router: Router,
        private memoryService: MemoryService

    ) {
        this.ngbModalRef = null;
    }
    
    setPos(lng:number, lat:number){
      this.lat = lat;
      this.lng = lng;
    }
    open(component: Component, id?: number | any, lng?:number | any, lat?:number | any): Promise<NgbModalRef> {
        console.log("esfes " + lng);
        return new Promise<NgbModalRef>((resolve, reject) => {
      
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }

            if (id) {
                this.memoryService.find(id)
                    .subscribe((memoryResponse: HttpResponse<Memory>) => {
                        const memory: Memory = memoryResponse.body;
                        memory.startDate = this.datePipe
                            .transform(memory.startDate, 'yyyy-MM-ddTHH:mm:ss');
                        memory.endDate = this.datePipe
                            .transform(memory.endDate, 'yyyy-MM-ddTHH:mm:ss');
                        this.ngbModalRef = this.memoryModalRef(component, memory);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
               
                    this.memory = new Memory();
                    this.memory.latitude = this.lat;
                    this.memory.longitude = this.lng;
                    console.log("mem " + JSON.stringify(this.memory));
                    this.ngbModalRef = this.memoryModalRef(component, this.memory);
                  
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    memoryModalRef(component: Component, memory: Memory): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.memory = memory;
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        });
        return modalRef;
    }
}
