import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpResponse, HttpErrorResponse} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {JhiEventManager} from 'ng-jhipster';

import {Photo} from './photo.model';
import {PhotoPopupService} from './photo-popup.service';
import {PhotoService} from './photo.service';

@Component({
    selector: 'jhi-photo-dialog',
    templateUrl: './photo-dialog.component.html'
})
export class PhotoDialogComponent implements OnInit {

    photo: Photo;
    isSaving: boolean;
    selectedFiles: FileList;
    currentFile: File;
    formData: FormData;
    
    constructor(
        public activeModal: NgbActiveModal,
        private photoService: PhotoService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    selectFile(event) {
        this.selectedFiles = event.target.files;
        console.log(this.selectedFiles);
    }

    save() {
        this.isSaving = true;
        if (this.photo.id !== undefined) {
            this.subscribeToSaveResponse(
                this.photoService.update(this.photo));
        } else {
            this.subscribeToSaveResponse(
           this.photoService.create(this.photo));
        }
    }

    fileChange(file) {
        let fileList: FileList = file.target.files;
        if (fileList.length > 0) {
            let file: File = fileList[0];
            this.photo.path = file;
            
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<any>>) {
        result.subscribe((res: HttpResponse<any>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: Photo) {
        this.eventManager.broadcast({ name: 'photoListModification', content: 'OK' });
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-photo-popup',
    template: ''
})
export class PhotoPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private photoPopupService: PhotoPopupService
    ) { }

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if (params['id']) {
                this.photoPopupService
                    .open(PhotoDialogComponent as Component, params['id']);
            } else {
                this.photoPopupService
                    .open(PhotoDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
