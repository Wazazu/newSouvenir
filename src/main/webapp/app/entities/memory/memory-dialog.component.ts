import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Memory } from './memory.model';
import { MemoryPopupService } from './memory-popup.service';
import { MemoryService } from './memory.service';
import { User, UserService } from '../../shared';

import { Subscription } from 'rxjs/Subscription';
@Component({
    selector: 'jhi-memory-dialog',
    templateUrl: './memory-dialog.component.html'
})
export class MemoryDialogComponent implements OnInit {

    memory: Memory;
    isSaving: boolean;
    lat:number;
    lng:number;
 
    users: User[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private memoryService: MemoryService,
        private userService: UserService,
        private eventManager: JhiEventManager,
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.userService.query()
            .subscribe((res: HttpResponse<User[]>) => { this.users = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
      
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.memory.id !== undefined) {
            this.subscribeToSaveResponse(
                this.memoryService.update(this.memory));
        } else {
            this.subscribeToSaveResponse(
                this.memoryService.create(this.memory));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<Memory>>) {
        result.subscribe((res: HttpResponse<Memory>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: Memory) {
        this.eventManager.broadcast({ name: 'memoryListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackUserById(index: number, item: User) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-memory-popup',
    template: ''
})
export class MemoryPopupComponent implements OnInit, OnDestroy {

    routeSub: any;
    lat:number;
    lng:number;

    constructor(
        private route: ActivatedRoute,
        private memoryPopupService: MemoryPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
           this.memoryPopupService.setPos(params['lat'], params['lng'])
            if ( params['id']) {
                this.memoryPopupService
                    .open(MemoryDialogComponent as Component, params['id']);
            }else {
                this.memoryPopupService
                    .open(MemoryDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
