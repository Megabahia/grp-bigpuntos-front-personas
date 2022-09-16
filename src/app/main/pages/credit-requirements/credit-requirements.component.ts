import {Component, OnInit} from '@angular/core';
import Decimal from 'decimal.js';
import {ParametrizacionesService} from '../../personas/servicios/parametrizaciones.service';

@Component({
  selector: 'app-credit-requirements',
  templateUrl: './credit-requirements.component.html',
  styleUrls: ['./credit-requirements.component.scss']
})
export class CreditRequirementsComponent implements OnInit {

  public coutaMensual;
  public montoCreditoFinal;
  public requisitos;
  public descripcion;


  constructor(
    private paramService: ParametrizacionesService,
  ) {
    this.coutaMensual = localStorage.getItem('coutaMensual');
    this.montoCreditoFinal = localStorage.getItem('montoCreditoFinal');
    const tipoPersona = localStorage.getItem('tipoPersona') === 'Empleado' ? 'REQUISITOS_EMPLEADO_CREDICOMPRA' : 'REQUISITOS_NEGOCIOS_CREDICOMPRA';
    this.getInfo();
  }

  ngOnInit(): void {
  }

  getInfo() {
    this.paramService.obtenerListaPadresSinToken('REQUISITOS_NEGOCIOS_CREDICOMPRA').subscribe((info) => {
      this.requisitos = info;
    });
    this.paramService.obtenerListaPadresSinToken('DESCRIPCION_REQUISITOS_CREDICOMPRA').subscribe((info) => {
      this.descripcion = info;
    });
  }

}
