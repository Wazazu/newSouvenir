/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { SouvenirTestModule } from '../../../test.module';
import { MapComponent } from '../../../../../../main/webapp/app/entities/map/map.component';
import { MapService } from '../../../../../../main/webapp/app/entities/map/map.service';
import { Map } from '../../../../../../main/webapp/app/entities/map/map.model';

describe('Component Tests', () => {

    describe('Map Management Component', () => {
        let comp: MapComponent;
        let fixture: ComponentFixture<MapComponent>;
        let service: MapService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [SouvenirTestModule],
                declarations: [MapComponent],
                providers: [
                    MapService
                ]
            })
            .overrideTemplate(MapComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(MapComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(MapService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new Map(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.maps[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
