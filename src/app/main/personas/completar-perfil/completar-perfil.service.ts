import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompletarPerfilService {

  constructor(private _httpClient: HttpClient) { }


  subirImagenRegistro(id, imagen) {
    return this._httpClient.post<any>(`${environment.apiUrl}/personas/personas/update/imagen/${id}`, imagen)
  }
}
