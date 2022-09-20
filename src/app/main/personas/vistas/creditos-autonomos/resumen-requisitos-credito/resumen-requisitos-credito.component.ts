import { Component, OnInit } from '@angular/core';
import {ParametrizacionesService} from '../../../servicios/parametrizaciones.service';

@Component({
  selector: 'app-resumen-requisitos-credito',
  templateUrl: './resumen-requisitos-credito.component.html',
  styleUrls: ['./resumen-requisitos-credito.component.scss']
})
export class ResumenRequisitosCreditoComponent implements OnInit {

  public coutaMensual;
  public montoCreditoFinal;
  public requisitos = {
    valor: '',
    config: [],
    nombre: '',
    _id: ''
  };
  public descripcion = {
    valor: '',
    config: [],
    nombre: '',
    _id: ''
  };
  public tipoPersona;

  constructor(
    private paramService: ParametrizacionesService,
  ) { }

  ngOnInit(): void {
    this.getInfo();
  }

  getInfo() {
    this.paramService.obtenerListaPadresSinToken(this.tipoPersona).subscribe((info) => {
      this.requisitos = info[0];
      this.requisitos.config = this.requisitos.config.slice(1, -1).toString().split(',').map(item => {
        return item.replace(/'/g, '');
      });
    });
    this.paramService.obtenerListaPadresSinToken('DESCRIPCION_REQUISITOS_CREDICOMPRA').subscribe((info) => {
      this.descripcion = info[0];
      this.descripcion.valor = this.descripcion.valor.replace('${{montoCreditoFinal}}', this.montoCreditoFinal);
      this.descripcion.valor = this.descripcion.valor.replace('${{coutaMensual}}', this.coutaMensual);
    });
  }

}
