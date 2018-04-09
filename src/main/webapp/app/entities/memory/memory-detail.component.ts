import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { Memory } from './memory.model';
import { MemoryService } from './memory.service';

@Component({
    selector: 'jhi-memory-detail',
    templateUrl: './memory-detail.component.html'
})
export class MemoryDetailComponent implements OnInit, OnDestroy {

    memory: Memory;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private memoryService: MemoryService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInMemories();
    }

    load(id) {
        this.memoryService.find(id)
            .subscribe((memoryResponse: HttpResponse<Memory>) => {
                this.memory = memoryResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInMemories() {
        this.eventSubscriber = this.eventManager.subscribe(
            'memoryListModification',
            (response) => this.load(this.memory.id)
        );
    }
}
