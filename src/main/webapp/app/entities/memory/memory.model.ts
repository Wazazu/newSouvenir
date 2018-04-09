import { BaseEntity, User } from './../../shared';

export class Memory implements BaseEntity {
    constructor(
        public id?: number,
        public title?: string,
        public description?: string,
        public startDate?: any,
        public endDate?: any,
        public longitude?: number,
        public latitude?: number,
        public user?: User,
        public photos?: BaseEntity[],
    ) {
    }
}
