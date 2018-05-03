import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
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
    galleryOptions: NgxGalleryOptions[];
    galleryImages: NgxGalleryImage[];
    constructor(
        private eventManager: JhiEventManager,
        private memoryService: MemoryService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.galleryOptions = [
            {
                width: '600px',
                height: '400px',
                thumbnailsColumns: 4,
                imageAnimation: NgxGalleryAnimation.Slide
            },
            // max-width 800
            {
                breakpoint: 800,
                width: '100%',
                height: '600px',
                imagePercent: 80,
                thumbnailsPercent: 20,
                thumbnailsMargin: 20,
                thumbnailMargin: 20
            },
            // max-width 400
            {
                breakpoint: 400,
                preview: false
            }
        ];

        this.galleryImages = [
            {
                small: 'https://images.pexels.com/photos/669006/pexels-photo-669006.jpeg?w=1260',
                medium: 'https://images.pexels.com/photos/669006/pexels-photo-669006.jpeg?w=1260',
                big: 'https://images.pexels.com/photos/669006/pexels-photo-669006.jpeg?w=1260'
            },
           {
                small: 'https://images.pexels.com/photos/669013/pexels-photo-669013.jpeg?w=1260',
                medium: 'https://images.pexels.com/photos/669013/pexels-photo-669013.jpeg?w=1260',
                big: 'https://images.pexels.com/photos/669013/pexels-photo-669013.jpeg?w=1260'
            },
            {
                small: 'http://www.preparer-mes-vacances.info/wp-content/uploads/2017/02/THA%C3%8FLANDE-1000x500.jpg',
                medium: 'http://www.preparer-mes-vacances.info/wp-content/uploads/2017/02/THA%C3%8FLANDE-1000x500.jpg',
                big: 'http://www.preparer-mes-vacances.info/wp-content/uploads/2017/02/THA%C3%8FLANDE-1000x500.jpg'
            },
            {
                small: 'https://media.nomadicmatt.com/kindsofbackpackers.jpg',
                medium: 'https://media.nomadicmatt.com/kindsofbackpackers.jpg',
                big: 'https://media.nomadicmatt.com/kindsofbackpackers.jpg'
            }
            
        ];
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
