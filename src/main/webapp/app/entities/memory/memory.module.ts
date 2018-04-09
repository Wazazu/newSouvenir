import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SouvenirSharedModule } from '../../shared';
import { SouvenirAdminModule } from '../../admin/admin.module';
import {
    MemoryService,
    MemoryPopupService,
    MemoryComponent,
    MemoryDetailComponent,
    MemoryDialogComponent,
    MemoryPopupComponent,
    MemoryDeletePopupComponent,
    MemoryDeleteDialogComponent,
    memoryRoute,
    memoryPopupRoute,
} from './';

const ENTITY_STATES = [
    ...memoryRoute,
    ...memoryPopupRoute,
];

@NgModule({
    imports: [
        SouvenirSharedModule,
        SouvenirAdminModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        MemoryComponent,
        MemoryDetailComponent,
        MemoryDialogComponent,
        MemoryDeleteDialogComponent,
        MemoryPopupComponent,
        MemoryDeletePopupComponent,
    ],
    entryComponents: [
        MemoryComponent,
        MemoryDialogComponent,
        MemoryPopupComponent,
        MemoryDeleteDialogComponent,
        MemoryDeletePopupComponent,
    ],
    providers: [
        MemoryService,
        MemoryPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SouvenirMemoryModule {}
