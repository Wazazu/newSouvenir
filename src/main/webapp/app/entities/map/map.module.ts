import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SouvenirSharedModule } from '../../shared';
import {
    MapService,
    MapPopupService,
    MapComponent,
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
        RouterModule.forChild(ENTITY_STATES)
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
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SouvenirMapModule {}
