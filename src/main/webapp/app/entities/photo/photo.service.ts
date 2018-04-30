import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {SERVER_API_URL} from '../../app.constants';

import {Photo} from './photo.model';
import {createRequestOption} from '../../shared';
import {HttpParams} from '@angular/common/http';
import {RequestOptions} from 'http';

export type EntityResponseType = HttpResponse<Photo>;

@Injectable()
export class PhotoService {

    private resourceUrl = SERVER_API_URL + 'api/photos';

    constructor(private http: HttpClient) { }

    create(photo: Photo): Observable<HttpResponse<any>> { 
        let formData: FormData = new FormData();
        if (photo.id != null)
            formData.append('id', String(photo.id));
        formData.append('description', photo.description);
        formData.append('file', photo.path, photo.path.name);
       
        return this.http.post<any>(this.resourceUrl, formData, { observe: 'response' });
    }

    update(photo: Photo):  Observable<HttpResponse<any>> {
        let formData: FormData = new FormData();
        formData.append('id', String(photo.id));
        formData.append('description', photo.description);
        formData.append('file', photo.path, photo.path.name);
      
        return this.http.put<any>(this.resourceUrl, formData, { observe: 'response' });
           
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Photo>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<Photo[]>> {
        const options = createRequestOption(req);
        return this.http.get<Photo[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Photo[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Photo = this.convertItemFromServer(res.body);
        console.log("hello");
        return res.clone({ body });
    }

    private convertArrayResponse(res: HttpResponse<Photo[]>): HttpResponse<Photo[]> {
        const jsonResponse: Photo[] = res.body;
        const body: Photo[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({ body });
    }

    /**
     * Convert a returned JSON object to Photo.
     */
    private convertItemFromServer(photo: Photo): Photo {
        const copy: Photo = Object.assign({}, photo);
        return copy;
    }

    /**
     * Convert a Photo to a JSON which can be sent to the server.
     */
    private convert(photo: Photo): Photo {
        const copy: Photo = Object.assign({}, photo);
        console.log("convert " + copy.path.name);
        return copy;
    }

    private convertWithFormData(photo: Photo, formData: FormData): Object {
        const copy: Object = Object.assign({}, photo, formData);
        return copy;
    }


}
