import {Component, OnInit} from '@angular/core';
import {ParametrizacionesService} from '../../../servicios/parametrizaciones.service';
import {CreditosAutonomosService} from '../creditos-autonomos.service';
import {SolicitarCredito} from '../../../models/persona';
import {CoreMenuService} from '../../../../../../@core/components/core-menu/core-menu.service';

@Component({
  selector: 'app-resumen-requisitos-credito',
  templateUrl: './resumen-requisitos-credito.component.html',
  styleUrls: ['./resumen-requisitos-credito.component.scss']
})
export class ResumenRequisitosCreditoComponent implements OnInit {

  public solicitarCredito;
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
  private usuario: any;

  constructor(
    private paramService: ParametrizacionesService,
    private _creditosAutonomosService: CreditosAutonomosService,
    private _coreMenuService: CoreMenuService,
  ) {
    this.usuario = this._coreMenuService.grpPersonasUser;
    this.solicitarCredito = this.inicialidarSolicitudCredito();
    this.coutaMensual = localStorage.getItem('coutaMensual');
    this.montoCreditoFinal = localStorage.getItem('montoCreditoFinal');
    this.tipoPersona = localStorage.getItem('tipoPersona') === 'Empleado' ? 'REQUISITOS_EMPLEADO_CREDICOMPRA' : 'REQUISITOS_NEGOCIOS_CREDICOMPRA';
  }

  ngOnInit(): void {
    this.getInfo();
  }

  inicialidarSolicitudCredito(): SolicitarCredito {
    return {
      _id: '',
      aceptaTerminos: 0,
      empresaComercial_id: '',
      empresaIfis_id: '',
      estado: 'Nuevo',
      monto: 0,
      plazo: 0,
      user_id: '',
      canal: 'Autonomo',
      tipoCredito: 'Autonomo',
      concepto: 'Autonomo',
      nombres: '',
      apellidos: '',
      numeroIdentificacion: '',
      user: '',
    };
  }

  getInfo() {
    this.paramService.obtenerListaPadresSinToken(this.tipoPersona).subscribe((info) => {
      this.requisitos = info[0];
      this.requisitos.config = this.requisitos.config.slice(1, -1).toString().split(',').map(item => {
        return item.replace(/'/g, '');
      });
    });
    this.paramService.obtenerListaPadresSinToken('TITULO_REQUISITOS_CREDICOMPRA_ULTIMA_PANTALLA').subscribe((info) => {
      this.descripcion = info[0];
      this.descripcion.valor = this.descripcion.valor.replace('${{montoCreditoFinal}}', this.montoCreditoFinal);
      this.descripcion.valor = this.descripcion.valor.replace('${{coutaMensual}}', this.coutaMensual);
    });
  }

  guardarCredito() {
    // Agregar informacion al credito
    this.solicitarCredito.nombres = this.usuario.persona.nombres;
    this.solicitarCredito.apellidos = this.usuario.persona.apellidos;
    this.solicitarCredito.numeroIdentificacion = this.usuario.persona.identificacion;
    this.solicitarCredito.user = this.usuario.persona;
    this.solicitarCredito.empresaComercial_id = localStorage.getItem('pagina');
    this._creditosAutonomosService.crearCredito(this.solicitarCredito).subscribe((info) => {
      console.log('se creo credito');
    });
  }

}
