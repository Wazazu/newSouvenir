import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { SouvenirPhotoModule } from './photo/photo.module';
import { SouvenirMemoryModule } from './memory/memory.module';
import { SouvenirMapModule } from './map/map.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    imports: [
        SouvenirPhotoModule,
        SouvenirMemoryModule,
        SouvenirMapModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SouvenirEntityModule {}
