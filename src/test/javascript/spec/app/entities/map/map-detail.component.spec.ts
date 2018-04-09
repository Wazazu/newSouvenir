/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { SouvenirTestModule } from '../../../test.module';
import { MapDetailComponent } from '../../../../../../main/webapp/app/entities/map/map-detail.component';
import { MapService } from '../../../../../../main/webapp/app/entities/map/map.service';
import { Map } from '../../../../../../main/webapp/app/entities/map/map.model';

describe('Component Tests', () => {

    describe('Map Management Detail Component', () => {
        let comp: MapDetailComponent;
        let fixture: ComponentFixture<MapDetailComponent>;
        let service: MapService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [SouvenirTestModule],
                declarations: [MapDetailComponent],
                providers: [
                    MapService
                ]
            })
            .overrideTemplate(MapDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(MapDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(MapService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new Map(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.map).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
