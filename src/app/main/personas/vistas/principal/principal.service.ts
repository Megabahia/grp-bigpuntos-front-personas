import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'environments/environment';

/**
 * Bigpuntos
 * PErsonas
 */

@Injectable({
    providedIn: 'root'
})
export class PrincipalService {

    constructor(private _httpClient: HttpClient) {
    }

    /**
     * MEtodo sirve para obtener las monedas del usuario
     */
    obtenerCantidadMonedas(id) {
        return this._httpClient.get<any>(`${environment.apiUrl}/core/monedas/usuario/${id}`);
    }

    /**
     * MEtodo sirve para listar los productos
     */
    obtenerProductosMostrar(datos) {
        return this._httpClient.post<any>(`${environment.apiUrl}/central/productos/list/`, datos);
    }

    /**
     * MEtodo sirve para obtener un producto
     */
    obtenerProducto(id) {
        return this._httpClient.get<any>(`${environment.apiUrl}/central/productos/listOne/${id}`,
        );
    }

}
