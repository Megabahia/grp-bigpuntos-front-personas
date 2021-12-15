import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PagarConSuperMonedasService {

  constructor(private _httpClient: HttpClient) { }

  obtenerListaMonedas(datos) {
    return this._httpClient.post<any>(`${environment.apiUrl}/core/monedas/list/otorgadas/`, datos);
  }
}
