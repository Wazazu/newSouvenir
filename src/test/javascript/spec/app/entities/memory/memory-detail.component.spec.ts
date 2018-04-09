/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { SouvenirTestModule } from '../../../test.module';
import { MemoryDetailComponent } from '../../../../../../main/webapp/app/entities/memory/memory-detail.component';
import { MemoryService } from '../../../../../../main/webapp/app/entities/memory/memory.service';
import { Memory } from '../../../../../../main/webapp/app/entities/memory/memory.model';

describe('Component Tests', () => {

    describe('Memory Management Detail Component', () => {
        let comp: MemoryDetailComponent;
        let fixture: ComponentFixture<MemoryDetailComponent>;
        let service: MemoryService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [SouvenirTestModule],
                declarations: [MemoryDetailComponent],
                providers: [
                    MemoryService
                ]
            })
            .overrideTemplate(MemoryDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(MemoryDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(MemoryService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new Memory(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.memory).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
