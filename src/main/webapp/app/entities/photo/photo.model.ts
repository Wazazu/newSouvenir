import { BaseEntity } from './../../shared';

export class Photo implements BaseEntity {
    constructor(
        public id?: number,
        public description?: string,
        public path?: string,
    ) {
    }
}
