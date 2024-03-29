import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import Decimal from 'decimal.js';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ParametrizacionesService} from '../../../personas/servicios/parametrizaciones.service';
import {CoreConfigService} from '../../../../../@core/services/config.service';

/**
 * Bigpuntos
 * Personas
 * ESta pantalla sirve para simular el credito
 * Rutas:
 * `${environment.apiUrl}/central/param/list/tipo/todos/free`,
 */

@Component({
    selector: 'app-simulator-credi-compra',
    templateUrl: './simulator-credi-compra.component.html',
    styleUrls: ['./simulator-credi-compra.component.scss']
})
export class SimulatorCrediCompraComponent implements OnInit {

    @ViewChild('modalAviso') modalAviso;
    public mensaje;
    public infoCreditForm: FormGroup;
    public listTipoPersona = [];
    public listEstadoCivil = [];
    public porcentajeConyuge = 2;
    public porcentajeCapacidaPago = 0.80;
    public tasaInteres = 17;
    public tasaInteresMensual = 0.0;
    public plazo = 12;
    public montoMaximo = 2500;
    public montoMinimo = 500;

    public submittedSimulador = false;
    public estadoCivil = false;


    constructor(
        private _router: Router,
        private _formBuilder: FormBuilder,
        private _coreConfigService: CoreConfigService,
        private paramService: ParametrizacionesService,
        private modalService: NgbModal,
    ) {
        if (localStorage.getItem('pagina') !== 'https://credicompra.com/') {
            this._router.navigate([
                `/grp/login`,
            ]);
            localStorage.clear();
            return;
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
        this.initInfoCreditForm();
        this.listCombosbox();
    }

    get infoCredit() {
        return this.infoCreditForm.controls;
    }

    initInfoCreditForm() {
        this.infoCreditForm = this._formBuilder.group({
            tipoPersona: ['', Validators.required],
            ingresosMensuales: ['', Validators.required],
            estadoCivil: ['', Validators.required],
            ingresosConyuge: [0],
            gastosMensuales: ['', Validators.required],
        });
    }

    listCombosbox() {
        this.paramService.obtenerListaPadresSinToken('TIPO_PERSONA').subscribe((info) => {
            this.listTipoPersona = info;
        });
        this.paramService.obtenerListaPadresSinToken('ESTADO_CIVIL').subscribe((info) => {
            this.listEstadoCivil = info;
        });
        this.paramService.obtenerListaPadresSinToken('VALORES_CALCULAR_CREDITO_CREDICOMPRA').subscribe((info) => {
            info.map(item => {
                if (item.nombre === 'PORCENTAJE_CONYUGE') {
                    this.porcentajeConyuge = new Decimal(item.valor).toNumber();
                }
                if (item.nombre === 'PORCENTAJE_CAPACIDAD_PAGO') {
                    this.porcentajeCapacidaPago = new Decimal(item.valor).div(100).toNumber();
                }
                if (item.nombre === 'TIEMPO_PLAZO') {
                    this.plazo = item.valor;
                }
                if (item.nombre === 'TASA_INTERES') {
                    this.tasaInteres = new Decimal(item.valor).toDecimalPlaces(2).toNumber();
                    this.tasaInteresMensual = new Decimal(item.valor).div(this.plazo).toDecimalPlaces(2).toNumber();
                }
                if (item.nombre === 'MONTO_MAXIMO') {
                    this.montoMaximo = item.valor;
                }
                if (item.nombre === 'MONTO_MINIMO') {
                    this.montoMinimo = item.valor;
                }
            });
        });
    }

    verificarEstadoCivil() {
        if (this.infoCreditForm.value['estadoCivil'].toUpperCase() === 'CASADO'
            || this.infoCreditForm.value['estadoCivil'].toUpperCase() === 'UNIÓN LIBRE') {
            this.infoCreditForm.get('ingresosConyuge').setValidators(Validators.required);
            this.infoCreditForm.get('ingresosConyuge').setErrors({'required': true});
            this.infoCreditForm.get('ingresosConyuge').setValue(null);
            this.estadoCivil = true;
        } else {
            this.infoCreditForm.get('ingresosConyuge').setValidators(null);
            this.infoCreditForm.get('ingresosConyuge').setErrors(null);
            this.infoCreditForm.get('ingresosConyuge').setValue(0);
            this.estadoCivil = false;
        }
    }

    calcular() {
        this.submittedSimulador = true;
        if (this.infoCreditForm.invalid) {
            return;
        }
        // Formula para el calculo interes
        const ingresosMensuales = new Decimal(this.infoCreditForm.get('ingresosMensuales').value);
        const ingresosConyuge = new Decimal(this.infoCreditForm.get('ingresosConyuge').value).toNumber() / 2;
        const gastosMensuales = new Decimal(this.infoCreditForm.get('gastosMensuales').value);
        const ingresoDisponible = ingresosMensuales.add(ingresosConyuge).sub(gastosMensuales).toDecimalPlaces(2).toNumber();
        if (ingresoDisponible === 0) {
            this.mensaje = '¡Lo sentimos! Con los datos ingresados lamentamos informarte que no cuentas con capacidad de pago.';
            this.abrirModalLg(this.modalAviso);
            return;
        }
        const capacidadPago = new Decimal(ingresoDisponible).mul(this.porcentajeCapacidaPago).floor().toNumber();

        const montoInteresMensual = new Decimal(capacidadPago).mul((this.tasaInteres / 100)).toDecimalPlaces(2).toNumber();

        let cuotaMensual = new Decimal(capacidadPago).add(montoInteresMensual).toDecimalPlaces(2).toNumber();

        const montoCredito = new Decimal(cuotaMensual).mul(12).toNumber();

        if (montoCredito === 0) {
            this.mensaje = '¡Lo sentimos! Con los datos ingresados lamentamos informarte que no cuentas con capacidad de pago.';
            this.abrirModalLg(this.modalAviso);
            return;
        }
        const resto = new Decimal(montoCredito.toString().substr(2, 4));
        const montoCreditoRedondeado = new Decimal(montoCredito).sub(resto).toNumber();
        let montoCreditoFinal = 0;
        if (montoCreditoRedondeado < this.montoMinimo) {
            this.mensaje = '¡Lo sentimos! Con los datos ingresados lamentamos informarte que no cuentas con capacidad de pago.';
            this.abrirModalLg(this.modalAviso);
            return;
        } else if (montoCreditoRedondeado >= this.montoMaximo) {
            montoCreditoFinal = this.montoMaximo;
            cuotaMensual = new Decimal(this.montoMaximo / 12).toDecimalPlaces(2).toNumber();
        } else {
            montoCreditoFinal = montoCreditoRedondeado;
        }
        localStorage.setItem('montoInteres', this.tasaInteres.toString());
        localStorage.setItem('coutaMensual', cuotaMensual.toString());
        localStorage.setItem('montoCreditoFinal', montoCreditoFinal.toString());
        localStorage.setItem('estadoCivil', this.infoCreditForm.value['estadoCivil']);
        localStorage.setItem('tipoPersona', this.infoCreditForm.value['tipoPersona']);
        this._router.navigate(['/pages/credito-consumo/requisitos']);
    }

    abrirModalLg(modal) {
        this.modalService.open(modal, {
            size: 'lg'
        });
    }
}
