import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { Map } from './map.model';
import { MapService } from './map.service';

@Component({
    selector: 'jhi-map-detail',
    templateUrl: './map-detail.component.html'
})
export class MapDetailComponent implements OnInit, OnDestroy {

    map: Map;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private mapService: MapService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInMaps();
    }

    load(id) {
        this.mapService.find(id)
            .subscribe((mapResponse: HttpResponse<Map>) => {
                this.map = mapResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInMaps() {
        this.eventSubscriber = this.eventManager.subscribe(
            'mapListModification',
            (response) => this.load(this.map.id)
        );
    }
}
