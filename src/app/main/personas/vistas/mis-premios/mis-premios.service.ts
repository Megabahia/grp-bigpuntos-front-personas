import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'environments/environment';

/**
 * Bigpuntos
 * PErsonas
 */

@Injectable({
    providedIn: 'root'
})
export class MisPremiosService {

    constructor(private _httpClient: HttpClient) {
    }

    /**
     * MEtodo sirve para listar los productos
     */
    obtenerListaProductos(datos) {
        return this._httpClient.post<any>(`${environment.apiUrl}/central/productos/list/`, datos);
    }

    /**
     * Metodo sirve para listar las empresas corp
     */
    obtenerListaEmpresasComerciales(datos) {
        return this._httpClient.post<any>(`${environment.apiUrl}/corp/empresas/list/comercial`, datos);
    }
}
