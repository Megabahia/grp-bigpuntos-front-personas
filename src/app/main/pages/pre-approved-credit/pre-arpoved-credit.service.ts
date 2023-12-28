import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'environments/environment';

/**
 * Bigpuntos
 * PErsonas
 */

@Injectable({
    providedIn: 'root',
})
export class PreArpovedCreditService {
    constructor(private _httpClient: HttpClient) {
    }

    /**
     * ESte metodo sirve para consultar el codigo del credito preaprobado
     */
    validateCredit(data) {
        return this._httpClient.post<any>(
            `${environment.apiUrl}/corp/creditoPersonas/creditoPreaprobado/codigo`,
            data
        );
    }
}
