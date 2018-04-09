import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { Memory } from './memory.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<Memory>;

@Injectable()
export class MemoryService {

    private resourceUrl =  SERVER_API_URL + 'api/memories';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(memory: Memory): Observable<EntityResponseType> {
        const copy = this.convert(memory);
        return this.http.post<Memory>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(memory: Memory): Observable<EntityResponseType> {
        const copy = this.convert(memory);
        return this.http.put<Memory>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Memory>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<Memory[]>> {
        const options = createRequestOption(req);
        return this.http.get<Memory[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Memory[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Memory = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Memory[]>): HttpResponse<Memory[]> {
        const jsonResponse: Memory[] = res.body;
        const body: Memory[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Memory.
     */
    private convertItemFromServer(memory: Memory): Memory {
        const copy: Memory = Object.assign({}, memory);
        copy.startDate = this.dateUtils
            .convertDateTimeFromServer(memory.startDate);
        copy.endDate = this.dateUtils
            .convertDateTimeFromServer(memory.endDate);
        return copy;
    }

    /**
     * Convert a Memory to a JSON which can be sent to the server.
     */
    private convert(memory: Memory): Memory {
        const copy: Memory = Object.assign({}, memory);

        copy.startDate = this.dateUtils.toDate(memory.startDate);

        copy.endDate = this.dateUtils.toDate(memory.endDate);
        return copy;
    }
}
