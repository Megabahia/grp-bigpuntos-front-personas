import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'environments/environment';

/**
 * Bigpuntos
 * Personas
 */

@Injectable({
    providedIn: 'root',
})
export class PagesViewsService {
    constructor(private _httpClient: HttpClient) {
    }

    /**
     * Este metodo sirve para crear el registro del correo landing
     */
    guardarEmail(datos) {
        return this._httpClient.post<any>(
            `${environment.apiUrl}/central/correosLanding/create/`,
            datos
        );
    }

    /**
     * ESte metoso sirve para actualizar un correo landing
     */
    actualizarCorreo(datos) {
        return this._httpClient.post<any>(
            `${environment.apiUrl}/central/correosLanding/update/${datos.id}`,
            datos
        );
    }

    /**
     * ESte metodo sirve para listar los productos
     */
    getlistaProductosfree(datos) {
        return this._httpClient.post<any>(
            `${environment.apiUrl}/central/productos/list-free/`,
            datos
        );
    }

    /**
     * Este metodo sirve para listar los productos del landing
     */
    getlistaProductosfreeLanding(datos) {
        return this._httpClient.post<any>(
            `${environment.apiUrl}/central/productos/list-free-landing/`,
            datos
        );
    }

    /**
     * Este metodo sirve para listar todos los productos
     */
    getlistaProductos(datos) {
        return this._httpClient.post<any>(
            `${environment.apiUrl}/central/productos/list/`,
            datos
        );
    }

    /**
     * Este metodo sirve para listar el catalogo por tipo
     */
    obtenerLista(tipo) {
        return this._httpClient.post<any>(
            `${environment.apiUrl}/central/param/list/tipo/todos/free`,
            {tipo}
        );
    }
}
