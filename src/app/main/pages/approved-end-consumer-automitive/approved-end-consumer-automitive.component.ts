import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CoreConfigService} from '../../../../@core/services/config.service';
import {ActivatedRoute, Router} from '@angular/router';
import {PreArpovedCreditService} from '../pre-approved-credit/pre-arpoved-credit.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import Decimal from 'decimal.js';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

/**
 * Bigpuntos
 * Personas
 * Esta pantalla sirve para mostrar la informacion final de la solicitud de credito
 * Rutas:
 * No tiene rutas
 */

@Component({
    selector: 'app-approved-end-consumer-automotive',
    templateUrl: './approved-end-consumer-automitive.component.html',
    styleUrls: ['./approved-end-consumer-automitive.component.scss']
})
export class ApprovedEndConsumerAutomitiveComponent implements OnInit {
    public envioForm: FormGroup;
    public submittedSimulador = false;
    public pathSent;
    @ViewChild('mensajeModal') mensajeModal;
    public mensaje = '';
    public monto;
    public usuario;
    public coreConfig: any;
    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _coreConfigService: CoreConfigService,
        private _formBuilder: FormBuilder,
        private _router: ActivatedRoute,
        private _routerN: Router,
        private _preArpovedCreditService: PreArpovedCreditService,
        private modalService: NgbModal,
    ) {
        const ref = document.referrer;
        const host = document.location.host;
        this._router.queryParams.subscribe((params) => {
            this.monto = params.monto;
            this.usuario = params.nombresCompleto;
        });

        // if (localStorage.getItem('preApproved')) {
        //     this._router.queryParams.subscribe((params) => {
        //         this.monto = params.monto;
        //         this.usuario = params.nombresCompleto;
        //     });
        //     localStorage.removeItem('preApproved');
        // } else {
        //     this.actionContinue();
        // }

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

    get getsimuladorForm() {
        return this.envioForm.controls;
    }

    cerrarModal() {
        this.modalService.dismissAll();
    }


    abrirModal(modal) {
        this.modalService.open(modal);
    }

    ngOnInit(): void {
        this.envioForm = this._formBuilder.group({
            code: [
                '',
                [
                    Validators.required,
                    Validators.pattern('^[0-9]*$'),
                    Validators.min(1),
                ],
            ],
        });
        // Subscribe to config changes
        this._unsubscribeAll = new Subject();
        this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
            this.coreConfig = config;
        });
    }

    actionContinue() {
        console.log('paso');
        this._routerN.navigate([
            `/grp/login`,
        ]);
    }
}
