import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { MouseEvent } from '@agm/core';
import { Map } from './map.model';
import { MapService } from './map.service';
import { Principal } from '../../shared';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ClickMarkerModalService} from '../../modal-click-marker/modal-click-marker.service';
import { Memory } from '../memory';
import { MemoryService } from '../memory/memory.service';

@Component({
    selector: 'jhi-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {
    maps: Map[];
    memories:Map[];
    currentAccount: any;
    eventSubscriber: Subscription;
    lat:number = 51.678418;
    lng:number = 7.809007;
    zoom:number = 8;
    modalRef: NgbModalRef;
    constructor(
        private memoryS:MemoryService,
        private modalClickMarker:ClickMarkerModalService,
        private mapService: MapService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal,
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
    loadMemories() {
        this.memoryS.query().subscribe(
            (res: HttpResponse<Memory[]>) => {
                this.memories = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.loadMemories();
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
  
    clickedMarker(titre: string, description: string) {
     this.modalRef = this.modalClickMarker.open(titre, description);
  }
  
  mapClicked($event: MouseEvent) {
    this.markers.push({
      lat: $event.coords.lat,
      lng: $event.coords.lng,
      draggable: true,
      titre:'titre'+ this.markers.length,
      description:'description'+ this.markers.length
    });
  }
  
  markerDragEnd(m: marker, $event: MouseEvent) {
    console.log('dragEnd', m, $event);
  }
  markers: marker[] = [
    {
      lat: 51.673858,
      lng: 7.815982,
      label: 'A',
      draggable: true,
      titre:'titre1',
      description :'description1',
    },
    {
      lat: 51.373858,
      lng: 7.215982,
      label: 'B',
      draggable: false,
      titre:'titre2',
      description :'description2',
    },
    {
      lat: 51.723858,
      lng: 7.895982,
      label: 'C',
      draggable: true,
      titre: 'titre3',
      description : 'description3',
    }
  ]
}

// just an interface for type safety.
interface marker {
  lat: number;
  lng: number;
  label: string;
  draggable: boolean;
  titre: string;
  description: string;
}

