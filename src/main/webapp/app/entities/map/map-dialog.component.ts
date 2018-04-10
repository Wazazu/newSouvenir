import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Map } from './map.model';
import { MapPopupService } from './map-popup.service';
import { MapService } from './map.service';

@Component({
    selector: 'jhi-map-dialog',
    templateUrl: './map-dialog.component.html'
})
export class MapDialogComponent implements OnInit {

    map: Map;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private mapService: MapService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.map.id !== undefined) {
            this.subscribeToSaveResponse(
                this.mapService.update(this.map));
        } else {
            this.subscribeToSaveResponse(
                this.mapService.create(this.map));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<Map>>) {
        result.subscribe((res: HttpResponse<Map>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: Map) {
        this.eventManager.broadcast({ name: 'mapListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-map-popup',
    template: ''
})
export class MapPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private mapPopupService: MapPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.mapPopupService
                    .open(MapDialogComponent as Component, params['id']);
            } else {
                this.mapPopupService
                    .open(MapDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
