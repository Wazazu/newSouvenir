import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { Map } from './map.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<Map>;

@Injectable()
export class MapService {

    private resourceUrl =  SERVER_API_URL + 'api/maps';

    constructor(private http: HttpClient) { }

    create(map: Map): Observable<EntityResponseType> {
        const copy = this.convert(map);
        return this.http.post<Map>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(map: Map): Observable<EntityResponseType> {
        const copy = this.convert(map);
        return this.http.put<Map>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Map>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<Map[]>> {
        const options = createRequestOption(req);
        return this.http.get<Map[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Map[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Map = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Map[]>): HttpResponse<Map[]> {
        const jsonResponse: Map[] = res.body;
        const body: Map[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Map.
     */
    private convertItemFromServer(map: Map): Map {
        const copy: Map = Object.assign({}, map);
        return copy;
    }

    /**
     * Convert a Map to a JSON which can be sent to the server.
     */
    private convert(map: Map): Map {
        const copy: Map = Object.assign({}, map);
        return copy;
    }
}
