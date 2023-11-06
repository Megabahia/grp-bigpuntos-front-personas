import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {CoreConfigService} from '../../../../@core/services/config.service';
import {PagesViewsService} from '../pages-views/pages-views.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {stringify} from 'querystring';

/**
 * Bigpuntos
 * Personas
 * Esta pantalla sirve para mostrar las opciones de la empresa para pagar con bigpuntos o ver premios
 * Ruta:
 *
 */

@Component({
    selector: 'app-pagina-empresa',
    templateUrl: './pagina-empresa.component.html',
    styleUrls: ['./pagina-empresa.component.scss']
})
export class PaginaEmpresaComponent implements OnInit {

    public empresa_id;

    public coreConfig: any;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {CoreConfigService} _coreConfigService
     */
    constructor(
        private _router: Router,
        private _coreConfigService: CoreConfigService,
        private rutaActiva: ActivatedRoute
    ) {
        this._unsubscribeAll = new Subject();

        // Configure the layout
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

        this.rutaActiva.params.subscribe((params: Params) => {
            this.empresa_id = params.empresa_id;
        });
    }

    // Lifecycle Hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to config changes
        this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
            this.coreConfig = config;
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    redirigirLogin(pantalla) {
        const semilla = {'empresa_id': this.empresa_id, 'pantalla': pantalla};
        localStorage.setItem('semillaPago', JSON.stringify(semilla));
        this._router.navigate([
            `/grp/login`,
        ]);
    }
}
