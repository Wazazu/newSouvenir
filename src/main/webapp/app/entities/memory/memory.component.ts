import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Memory } from './memory.model';
import { MemoryService } from './memory.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-memory',
    templateUrl: './memory.component.html'
})
export class MemoryComponent implements OnInit, OnDestroy {
memories: Memory[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private memoryService: MemoryService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.memoryService.query().subscribe(
            (res: HttpResponse<Memory[]>) => {
                this.memories = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInMemories();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: Memory) {
        return item.id;
    }
    registerChangeInMemories() {
        this.eventSubscriber = this.eventManager.subscribe('memoryListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
