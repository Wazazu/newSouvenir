/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { SouvenirTestModule } from '../../../test.module';
import { MemoryDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/memory/memory-delete-dialog.component';
import { MemoryService } from '../../../../../../main/webapp/app/entities/memory/memory.service';

describe('Component Tests', () => {

    describe('Memory Management Delete Component', () => {
        let comp: MemoryDeleteDialogComponent;
        let fixture: ComponentFixture<MemoryDeleteDialogComponent>;
        let service: MemoryService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [SouvenirTestModule],
                declarations: [MemoryDeleteDialogComponent],
                providers: [
                    MemoryService
                ]
            })
            .overrideTemplate(MemoryDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(MemoryDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(MemoryService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        spyOn(service, 'delete').and.returnValue(Observable.of({}));

                        // WHEN
                        comp.confirmDelete(123);
                        tick();

                        // THEN
                        expect(service.delete).toHaveBeenCalledWith(123);
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
