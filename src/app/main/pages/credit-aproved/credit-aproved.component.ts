import { Component, OnInit } from '@angular/core';
import { CoreConfigService } from '../../../../@core/services/config.service';
import { ActivatedRoute, Router } from '@angular/router';

/**
 * Bigpuntos
 * PErsonas
 * Esta pantalla sirve para mostrar la informacion de felicitaciones por el credito
 * Rutas:
 * No llama a ninguna ruta
 */

@Component({
    selector: 'app-credit-aproved',
    templateUrl: './credit-aproved.component.html',
    styleUrls: ['../simulador/simulador.component.scss']
})
export class CreditAprovedComponent implements OnInit {
    public monto;

    constructor(private _coreConfigService: CoreConfigService,
                private _router: ActivatedRoute,
                private _routerN: Router,
    ) {
        if (localStorage.getItem('preApproved')) {
            this._router.queryParams.subscribe((params) => {
                this.monto = params.monto;
            });
            localStorage.removeItem('preApproved');
        } else {
            this.actionContinue();
        }

        this._coreConfigService.config = {
            layout: {
                navbar: {
                    hidden: true,
                },
                footer: {
                    hidden: true,
                },
                menu: {
                    hidden: true,
                },
                customizer: false,
                enableLocalStorage: false,
            },
        };
    }

    ngOnInit(): void {
    }

    actionContinue() {
        this._routerN.navigate([
            `/grp/login`,
        ]);
    }

}
