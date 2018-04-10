import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { MapComponent } from './map.component';
import { AgmCoreModule } from '@agm/core';
import { SouvenirSharedModule } from '../../shared';
import {
    MapService,
    MapPopupService,
    MapDetailComponent,
    MapDialogComponent,
    MapPopupComponent,
    MapDeletePopupComponent,
    MapDeleteDialogComponent,
    mapRoute,
    mapPopupRoute,
} from './';

const ENTITY_STATES = [
    ...mapRoute,
    ...mapPopupRoute,
];

@NgModule({
    imports: [
        SouvenirSharedModule,
        RouterModule.forChild(ENTITY_STATES),
        BrowserModule,
        FormsModule,
        AgmCoreModule.forRoot({
      // please get your own API key here:
      // https://developers.google.com/maps/documentation/javascript/get-api-key?hl=en
      apiKey: 'AIzaSyA0GZAMJp02jJ-Gir282oB_mV38SP_U3WI'
    })
    ],
    declarations: [
        MapComponent,
        MapDetailComponent,
        MapDialogComponent,
        MapDeleteDialogComponent,
        MapPopupComponent,
        MapDeletePopupComponent,
    ],
    entryComponents: [
        MapComponent,
        MapDialogComponent,
        MapPopupComponent,
        MapDeleteDialogComponent,
        MapDeletePopupComponent,
    ],
    providers: [
        MapService,
        MapPopupService,
    ],
    bootstrap: [
      MapComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SouvenirMapModule {}




