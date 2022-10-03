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
          this.porcentajeConyuge = new Decimal(item.valor).div(100).toNumber();
        }
        if (item.nombre === 'PORCENTAJE_CAPACIDAD_PAGO') {
          this.porcentajeCapacidaPago = new Decimal(item.valor).div(100).toNumber();
        }
        if (item.nombre === 'TASA_INTERES') {
          this.tasaInteres = new Decimal(item.valor).div(100).toNumber();
        }
        if (item.nombre === 'TIEMPO_PLAZO') {
          this.plazo = item.valor;
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
    if (this.infoCreditForm.value['estadoCivil'].toUpperCase() === 'CASADO' || this.infoCreditForm.value['estadoCivil'].toUpperCase() === 'UNIÓN LIBRE') {
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
    const ingresosConyuge = new Decimal(this.infoCreditForm.get('ingresosConyuge').value);
    const gastosMensuales = new Decimal(this.infoCreditForm.get('gastosMensuales').value);
    const ingresoDisponible = ingresosMensuales.add(ingresosConyuge.mul(this.porcentajeConyuge)).sub(gastosMensuales).floor().toNumber();
    const capacidadPago = new Decimal(ingresoDisponible).mul(this.porcentajeCapacidaPago).floor().toNumber();
    const montoCreditoCalculado = new Decimal(capacidadPago).mul(12).floor().toNumber();
    const montoCreditoRedondeado = new Decimal(montoCreditoCalculado)
      .sub(new Decimal(montoCreditoCalculado.toString().substr(2, 4)).floor().toNumber()).toNumber();
    let montoCreditoFinal = 0;
    if ( montoCreditoRedondeado <= this.montoMinimo) {
      montoCreditoFinal = this.montoMinimo;
    } else if (montoCreditoRedondeado >= this.montoMaximo) {
      montoCreditoFinal = this.montoMaximo;
    } else {
      montoCreditoFinal = montoCreditoRedondeado;
    }
    const montoInteres = new Decimal(montoCreditoFinal).mul(this.tasaInteres).floor().toNumber();
    const coutaMensual = new Decimal(new Decimal(montoCreditoFinal).add(montoInteres).floor().toNumber()).div(this.plazo)
      .floor().toNumber();
    localStorage.setItem('montoInteres', montoInteres.toString());
    localStorage.setItem('coutaMensual', coutaMensual.toString());
    localStorage.setItem('montoCreditoFinal', montoCreditoFinal.toString());
    localStorage.setItem('estadoCivil', this.infoCreditForm.value['estadoCivil']);
    localStorage.setItem('tipoPersona', this.infoCreditForm.value['tipoPersona']);
    this._router.navigate(['/pages/requisitos-de-credito']);
  }

}
