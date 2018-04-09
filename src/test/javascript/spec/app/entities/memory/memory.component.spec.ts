/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { SouvenirTestModule } from '../../../test.module';
import { MemoryComponent } from '../../../../../../main/webapp/app/entities/memory/memory.component';
import { MemoryService } from '../../../../../../main/webapp/app/entities/memory/memory.service';
import { Memory } from '../../../../../../main/webapp/app/entities/memory/memory.model';

describe('Component Tests', () => {

    describe('Memory Management Component', () => {
        let comp: MemoryComponent;
        let fixture: ComponentFixture<MemoryComponent>;
        let service: MemoryService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [SouvenirTestModule],
                declarations: [MemoryComponent],
                providers: [
                    MemoryService
                ]
            })
            .overrideTemplate(MemoryComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(MemoryComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(MemoryService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new Memory(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.memories[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
