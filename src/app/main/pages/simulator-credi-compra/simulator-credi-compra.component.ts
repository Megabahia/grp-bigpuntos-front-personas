import {Component, OnInit} from '@angular/core';
import {CoreConfigService} from '../../../../@core/services/config.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ParametrizacionesService} from '../../personas/servicios/parametrizaciones.service';
import Decimal from 'decimal.js';
import {Router} from '@angular/router';

@Component({
  selector: 'app-simulator-credi-compra',
  templateUrl: './simulator-credi-compra.component.html',
  styleUrls: ['../simulador/simulador.component.scss']
})
export class SimulatorCrediCompraComponent implements OnInit {

  public infoCreditForm: FormGroup;
  public listTipoPersona = [];
  public listEstadoCivil = [];
  public porcentajeConyuge = 0.50;
  public porcentajeCapacidaPago = 0.80;
  public tasaInteres = 17;
  public tiempo = 12;

  public submittedSimulador = false;
  public estadoCivil = false;


  constructor(
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _coreConfigService: CoreConfigService,
    private paramService: ParametrizacionesService,
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
  }

  verificarEstadoCivil() {
    if (this.infoCreditForm.value['estadoCivil'].toUpperCase() === 'CASADO' || this.infoCreditForm.value['estadoCivil'].toUpperCase() === 'UNIÓN LIBRE') {
      this.infoCreditForm.get('ingresosConyuge').setValidators(null);
      this.infoCreditForm.get('ingresosConyuge').setErrors(null);
      this.infoCreditForm.get('ingresosConyuge').setValue(0);
      this.estadoCivil = true;
    } else {
      this.infoCreditForm.get('ingresosConyuge').setValidators(Validators.required);
      this.infoCreditForm.get('ingresosConyuge').setErrors({'required': true});
      this.estadoCivil = false;
    }
  }

  calcular() {
    this.submittedSimulador = true;
    // if (this.infoCreditForm.invalid) {
    //   return;
    // }
    // Formula para el calculo interes
    const ingresosMensuales = new Decimal(this.infoCreditForm.get('ingresosMensuales').value);
    const ingresosConyuge = new Decimal(this.infoCreditForm.get('ingresosConyuge').value);
    const gastosMensuales = new Decimal(this.infoCreditForm.get('gastosMensuales').value);
    const ingresoDisponible = ingresosMensuales.add(ingresosConyuge.mul(this.porcentajeConyuge)).sub(gastosMensuales).floor().toNumber();
    const capacidadPago = new Decimal(ingresoDisponible).mul(this.porcentajeCapacidaPago).floor().toNumber();
    const tasaInteresMensual = new Decimal(this.tasaInteres).sub(this.tiempo).floor().toNumber();
    const coutaMensual = new Decimal(capacidadPago).mul(tasaInteresMensual).floor().toNumber();
    const montoCredito = new Decimal(coutaMensual).mul(this.tiempo).floor().toNumber();
    let montoCreditoFinal = 0;
    if (montoCredito >= 2500) {
      montoCreditoFinal = 2500;
    } else if (montoCredito <= 500) {
      montoCreditoFinal = 500;
    } else {
      montoCreditoFinal = montoCredito;
    }
    localStorage.setItem('coutaMensual', coutaMensual.toString());
    localStorage.setItem('montoCreditoFinal', montoCreditoFinal.toString());
    localStorage.setItem('tipoPersona', this.infoCreditForm.value['tipoPersona']);
    this._router.navigate(['/login']);
  }

}
