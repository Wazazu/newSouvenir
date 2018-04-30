import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SouvenirSharedModule } from '../../shared';
import {
    PhotoService,
    PhotoPopupService,
    PhotoComponent,
    PhotoDetailComponent,
    PhotoDialogComponent,
    PhotoPopupComponent,
    PhotoDeletePopupComponent,
    PhotoDeleteDialogComponent,
    photoRoute,
    photoPopupRoute,
} from './';

const ENTITY_STATES = [
    ...photoRoute,
    ...photoPopupRoute,
];

@NgModule({
    imports: [
        SouvenirSharedModule,
        HttpClientModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        PhotoComponent,
        PhotoDetailComponent,
        PhotoDialogComponent,
        PhotoDeleteDialogComponent,
        PhotoPopupComponent,
        PhotoDeletePopupComponent,
    ],
    entryComponents: [
        PhotoComponent,
        PhotoDialogComponent,
        PhotoPopupComponent,
        PhotoDeleteDialogComponent,
        PhotoDeletePopupComponent,
    ],
    providers: [
        PhotoService,
        PhotoPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SouvenirPhotoModule {}
