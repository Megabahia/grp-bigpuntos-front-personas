import {Component, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {DomSanitizer} from '@angular/platform-browser';
import {ParametrizacionesService} from '../../servicios/parametrizaciones.service';

/**
 * Bigpuntos
 * Personas
 * Esta pantalla sirve para mostrar como funciona bigpuntos
 * Rutas:
 * No tiene llamado de rutas
 */

@Component({
    selector: 'app-como-funciona',
    templateUrl: './como-funciona.component.html',
    styleUrls: ['./como-funciona.component.scss']
})
export class ComoFuncionaComponent implements OnInit {
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
