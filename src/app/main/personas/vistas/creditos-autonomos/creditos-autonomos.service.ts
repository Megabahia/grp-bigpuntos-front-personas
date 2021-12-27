import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CreditosAutonomosService {

  constructor(private _httpClient: HttpClient) { }

  obtenerListaEmpresasComerciales(datos) {
    return this._httpClient.post<any>(`${environment.apiUrl}/corp/empresas/list/ifis`, datos);
  }
  obtenerDatosRuc(id) {
    return this._httpClient.get<any>(`${environment.apiUrl}/personas/rucPersonas/listOne/${id}`);
  }
  obtenerEmpresa(id){
    return this._httpClient.get<any>(`${environment.apiUrl}/corp/empresas/listOne/${id}` );

  }
  guardarInformacion(datos) {
    return this._httpClient.post<any>(`${environment.apiUrl}/personas/personas/update/${datos.user_id}`, datos);
  }

  obtenerInformacion(id) {
    return this._httpClient.get<any>(`${environment.apiUrl}/personas/personas/listOne/${id}`,);
  }
}
