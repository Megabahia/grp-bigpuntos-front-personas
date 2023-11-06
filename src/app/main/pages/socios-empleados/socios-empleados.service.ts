import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';

/**
 * Bigpuntos
 * Personas
 */

@Injectable({
    providedIn: 'root'
})
export class SociosEmpleadosService {

    constructor(
        private _httpClient: HttpClient
    ) {
    }

    /**
     * Este metodo sirve para listar el catalogo por tipo
     */
    obtenerListaPadresSinToken(tipo) {
        return this._httpClient.post<any>(
            `${environment.apiUrl}/central/param/list/tipo/todos/free`,
            {tipo}
        );
    }

    /**
     * Este metodo sirve para listar la informacion de la empresa
     */
    obtenerListaParametrosEmpresas(url) {
        return this._httpClient.get<any>(`${environment.apiUrl}/central/empresas/url/${url}`);
    }

    /**
     * Este metodo sirve para listar la informacion de la empresa
     */
    obtenerListaParametrosEmpresasClientes(url) {
        return this._httpClient.get<any>(`${environment.apiUrl}/central/empresas/urlClientes/${url}`);
    }
}
