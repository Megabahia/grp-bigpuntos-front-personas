import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PagarConSuperMonedasService {

  constructor(private _httpClient: HttpClient) { }

  obtenerListaEmpresa(datos) {
    return this._httpClient.post<any>(`${environment.apiUrl}/corp/empresas/list/`, datos);
  }
  pagarConSuperMonedas(datos){
    return this._httpClient.post<any>(`${environment.apiUrl}/corp/pagos/create/`, datos);
  }
}
