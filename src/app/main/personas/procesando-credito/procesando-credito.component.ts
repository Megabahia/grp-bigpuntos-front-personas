import {Component, OnInit, ViewChild} from '@angular/core';
import {CoreConfigService} from '../../../../@core/services/config.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

/**
 * Bigpuntos
 * Personas
 * Esta pantalla sirve para mostrar el proceso de la solicitud de credito
 * Rutas:
 * No tiene llamado a rutas
 */

@Component({
    selector: 'app-procesando-credito',
    templateUrl: './procesando-credito.component.html',
    styleUrls: ['./procesando-credito.component.scss']
})
export class ProcesandoCreditoComponent implements OnInit {
    @ViewChild('establecimientoSeleccionadoMdl') establecimientoSeleccionadoMdl;
    email = '';

    constructor(
        private _coreConfigService: CoreConfigService,
        private modalService: NgbModal,
    ) {
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
        const grpPersonasUser = JSON.parse(localStorage.getItem('grpPersonasUser'));
        this.email = grpPersonasUser.email;
    }

    abrirModal() {
        this.abrirModalLg(this.establecimientoSeleccionadoMdl);
    }

    abrirModalLg(modal) {
        this.modalService.open(modal, {
            size: 'lg'
        });
    }

    ngOnInit(): void {

    }

}
