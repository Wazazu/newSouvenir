import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Map } from './map.model';
import { MapService } from './map.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-map',
    templateUrl: './map.component.html'
})
export class MapComponent implements OnInit, OnDestroy {
maps: Map[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private mapService: MapService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.mapService.query().subscribe(
            (res: HttpResponse<Map[]>) => {
                this.maps = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInMaps();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: Map) {
        return item.id;
    }
    registerChangeInMaps() {
        this.eventSubscriber = this.eventManager.subscribe('mapListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
