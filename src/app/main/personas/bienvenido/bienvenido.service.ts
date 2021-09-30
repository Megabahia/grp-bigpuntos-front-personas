import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BienvenidoService {

  constructor(private _httpClient: HttpClient) { }

  cambioDeEstado(datos) {
    return this._httpClient.post<any>(`${environment.apiUrl}/central/usuarios/update/${datos.id}`,
      { estado: datos.estado }
    );
  }
}
