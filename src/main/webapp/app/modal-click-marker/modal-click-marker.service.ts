import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { ModalClickMarkerComponent } from './modal-click-marker.component';

@Injectable()
export class ClickMarkerModalService {
    private isOpen = false;
    constructor(
        private modalService: NgbModal,
    ) {}

    open(id:number, titre:string, description:string, lat:number, lng:number): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;
        const modalRef = this.modalService.open(ModalClickMarkerComponent);
        if(id != null){
          modalRef.componentInstance.idMemory = id;
        }
        else{
           modalRef.componentInstance.idMemory = null;
        }
      
        if(titre != null){
          modalRef.componentInstance.titre = titre;
        }
        else{
          modalRef.componentInstance.titre = "Titre à définir";
        }
      
        if(description != null){
          modalRef.componentInstance.description = description;
        }
        else{
           modalRef.componentInstance.description = "Description à définir";
        }
 
        modalRef.componentInstance.lat = lat;
        modalRef.componentInstance.lng = lng;
      
        modalRef.result.then((result) => {
            this.isOpen = false;
        }, (reason) => {
            this.isOpen = false;
        });
        return modalRef;
    }
}
