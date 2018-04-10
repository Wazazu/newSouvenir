import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { MapComponent } from './map.component';
import { MapDetailComponent } from './map-detail.component';
import { MapPopupComponent } from './map-dialog.component';
import { MapDeletePopupComponent } from './map-delete-dialog.component';

export const mapRoute: Routes = [
    {
        path: 'map',
        component: MapComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Maps'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'map/:id',
        component: MapDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Maps'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const mapPopupRoute: Routes = [
    {
        path: 'map-new',
        component: MapPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Maps'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'map/:id/edit',
        component: MapPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Maps'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'map/:id/delete',
        component: MapDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Maps'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
