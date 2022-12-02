import { Injectable } from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SociosEmpleadosService {

  constructor(
      private _httpClient: HttpClient
  ) { }
  obtenerListaPadresSinToken(tipo) {
    return this._httpClient.post<any>(
        `${environment.apiUrl}/central/param/list/tipo/todos/free`,
        {tipo}
    );
  }
}
