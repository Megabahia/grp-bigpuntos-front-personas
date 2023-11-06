import {Component, OnInit} from '@angular/core';
import {CoreConfigService} from '../../../../@core/services/config.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

/**
 * Bigpuntos
 * PErsonas
 * Esta pantalla sirve para mostrar los terminos y condiciones
 * Rutas:
 * No tiene llamado de rutas
 */

@Component({
    selector: 'app-terminos-condiciones',
    templateUrl: './terminos-condiciones.component.html',
    styleUrls: ['./terminos-condiciones.component.scss']
})
export class TerminosCondicionesComponent implements OnInit {
    public coreConfig: any;
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _coreConfigService: CoreConfigService,
    ) {
        this._unsubscribeAll = new Subject();

        this._coreConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                },
                menu: {
                    hidden: true
                },
                customizer: false,
                enableLocalStorage: false
            }
        };
    }

    ngOnInit(): void {
        this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
            this.coreConfig = config;
        });
    }

}
