import { Component, OnInit } from '@angular/core';
import {Subject} from 'rxjs';
import {ParametrizacionesService} from '../../servicios/parametrizaciones.service';
import {DomSanitizer} from '@angular/platform-browser';

/**
 * Bigpuntos
 * PErsonas
 * Esta pantalla sirve para mostrar informacion de como acceder a credicompra
 * Rutas:
 * No tiene llamado de rutas
 */

@Component({
  selector: 'app-como-acceder-a-credicompra',
  templateUrl: './como-acceder-a-credicompra.component.html',
  styleUrls: ['./como-acceder-a-credicompra.component.scss']
})
export class ComoAccederACredicompraComponent implements OnInit {
  public imagenes = [];
  private _unsubscribeAll: Subject<any>;

  constructor(
      private _paramService: ParametrizacionesService,
      private sanitizer: DomSanitizer
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  obtenerURL(i) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.imagenes[i].url);
  }
}
