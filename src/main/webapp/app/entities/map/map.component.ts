import {Component, OnInit, OnDestroy, ElementRef, NgModule, NgZone, ViewChild} from '@angular/core';
import {HttpResponse, HttpErrorResponse} from '@angular/common/http';
import {Subscription} from 'rxjs/Subscription';
import {JhiEventManager, JhiAlertService} from 'ng-jhipster';
import {MouseEvent} from '@agm/core';
import {Map} from './map.model';
import {MapService} from './map.service';
import {Principal} from '../../shared';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ClickMarkerModalService} from '../../modal-click-marker/modal-click-marker.service';
import {Memory} from '../memory';
import {MemoryService} from '../memory/memory.service';

import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {AgmCoreModule, MapsAPILoader} from '@agm/core';
import {} from '@types/googlemaps';
declare var google: any;

@Component({
  selector: 'jhi-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {
  maps: Map[];
  memories: Memory[];
  newMemoryAdded : boolean;
  currentAccount: any;
  eventSubscriber: Subscription;
  lat: number = 51.678418;
  lng: number = 7.809007;
  zoom: number = 8;
  searchControl: FormControl;
  modalRef: NgbModalRef;
  
  @ViewChild("search")
  searchElementRef: ElementRef;
  
  newSouvenirAdded: boolean = false;
  newSouvenirDeleted: boolean = true;
  
  constructor(
    private memoryS: MemoryService,
    private modalClickMarker: ClickMarkerModalService,
    private mapService: MapService,
    private jhiAlertService: JhiAlertService,
    private eventManager: JhiEventManager,
    private principal: Principal,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
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
    //create search FormControl
    this.searchControl = new FormControl();
    //set current position
    this.setCurrentPosition();
    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["(regions)"]
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          //set latitude, longitude and zoom
          this.lat = place.geometry.location.lat();
          this.lng = place.geometry.location.lng();
          this.zoom = 12;
        });
      });
    });
  }
  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.zoom = 12;
      });
    }
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
  clickedMarker(id:number, titre: string, description: string) {
    this.modalRef = this.modalClickMarker.open(id, titre, description, this.lat, this.lng);
  }
  
   memoryDragEnd(m: memory, $event: MouseEvent) {
    m.latitude = $event.coords.lat;
    m.longitude = $event.coords.lng;
    this.lat = m.latitude;
    this.lng = m.longitude;

  }
  
  addMemory(){
     this.memories.push({
        latitude: this.lat,
        longitude: this.lng,
        title:null,
        description:null
     });
    this.newSouvenirAdded = true;
    this.newSouvenirDeleted = false;
  }
  supprMemory(){
    this.memories.pop();
     this.newSouvenirAdded = false;
    this.newSouvenirDeleted = true;
  }
}


// just an interface for type safety.
interface memory {
  latitude: number;
  longitude: number;
  draggable: boolean,
  title: string;
  description: string;
}

