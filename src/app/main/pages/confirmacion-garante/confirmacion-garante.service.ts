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
export class ConfirmacionGaranteService {
    constructor(private _httpClient: HttpClient) {
    }

    /**
     * ESte metodo sirve para obtener el credito persona
     */
    getOneCreditoPersona(data) {
        return this._httpClient.post<any>(`${environment.apiUrl}/corp/creditoPersonas/listOneSinAutenticar/${data._id}`, data);
    }

    /**
     * ESte metodo sirve para actualizar el credito persona
     */
    updateCreditoPersona(data) {
        return this._httpClient.post<any>(`${environment.apiUrl}/corp/creditoPersonas/updateSinAutenticar/${data._id}`, data);
    }
}
