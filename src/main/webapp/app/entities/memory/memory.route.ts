import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { MemoryComponent } from './memory.component';
import { MemoryDetailComponent } from './memory-detail.component';
import { MemoryPopupComponent } from './memory-dialog.component';
import { MemoryDeletePopupComponent } from './memory-delete-dialog.component';

export const memoryRoute: Routes = [
    {
        path: 'memory',
        component: MemoryComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Memories'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'memory/:id',
        component: MemoryDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Memories'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'memory-new/:lat/:lng',
        component: MemoryDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Memories'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const memoryPopupRoute: Routes = [
    {
        path: 'memory-new/:lat/:lng',
        component: MemoryPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Memories',
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'memory/:id/edit',
        component: MemoryPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Memories'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'memory/:id/delete',
        component: MemoryDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Memories'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
