import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class MisPremiosService {

    constructor(private _httpClient: HttpClient) {
    }

    obtenerListaProductos(datos) {
        return this._httpClient.post<any>(`${environment.apiUrl}/central/productos/list/`, datos);
    }
    obtenerListaEmpresasComerciales(datos) {
        return this._httpClient.post<any>(`${environment.apiUrl}/corp/empresas/list/comercial`, datos);
    }
}
