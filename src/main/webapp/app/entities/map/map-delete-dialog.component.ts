import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Map } from './map.model';
import { MapPopupService } from './map-popup.service';
import { MapService } from './map.service';

@Component({
    selector: 'jhi-map-delete-dialog',
    templateUrl: './map-delete-dialog.component.html'
})
export class MapDeleteDialogComponent {

    map: Map;

    constructor(
        private mapService: MapService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.mapService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'mapListModification',
                content: 'Deleted an map'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-map-delete-popup',
    template: ''
})
export class MapDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private mapPopupService: MapPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.mapPopupService
                .open(MapDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
