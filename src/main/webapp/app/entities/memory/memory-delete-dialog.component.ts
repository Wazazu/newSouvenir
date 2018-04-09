import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Memory } from './memory.model';
import { MemoryPopupService } from './memory-popup.service';
import { MemoryService } from './memory.service';

@Component({
    selector: 'jhi-memory-delete-dialog',
    templateUrl: './memory-delete-dialog.component.html'
})
export class MemoryDeleteDialogComponent {

    memory: Memory;

    constructor(
        private memoryService: MemoryService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.memoryService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'memoryListModification',
                content: 'Deleted an memory'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-memory-delete-popup',
    template: ''
})
export class MemoryDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private memoryPopupService: MemoryPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.memoryPopupService
                .open(MemoryDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
