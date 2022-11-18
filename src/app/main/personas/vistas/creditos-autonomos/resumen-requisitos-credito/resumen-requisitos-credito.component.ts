import {Component, OnInit} from '@angular/core';
import {ParametrizacionesService} from '../../../servicios/parametrizaciones.service';
import {CreditosAutonomosService} from '../creditos-autonomos.service';
import {SolicitarCredito} from '../../../models/persona';
import {CoreMenuService} from '../../../../../../@core/components/core-menu/core-menu.service';
import {Router} from '@angular/router';
import {Parser} from '@angular/compiler';
import {takeUntil} from 'rxjs/operators';
import {CoreConfigService} from '../../../../../../@core/services/config.service';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-resumen-requisitos-credito',
  templateUrl: './resumen-requisitos-credito.component.html',
  styleUrls: ['./resumen-requisitos-credito.component.scss']
})
export class ResumenRequisitosCreditoComponent implements OnInit {

  public coreConfig: any;
  private _unsubscribeAll: Subject<any>;
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
    private _router: Router,
    private paramService: ParametrizacionesService,
    private _creditosAutonomosService: CreditosAutonomosService,
    private _coreMenuService: CoreMenuService,
    private _coreConfigService: CoreConfigService,
  ) {
    this._unsubscribeAll = new Subject();
    this.usuario = this._coreMenuService.grpPersonasUser;
    this.coutaMensual = localStorage.getItem('coutaMensual');
    this.montoCreditoFinal = localStorage.getItem('montoCreditoFinal');
    const casados = ['UNIÓN LIBRE', 'CASADO'];
    let tipoPersona;
    let estadoCivil;
    if (localStorage.getItem('tipoPersona') === 'Empleado') {
      tipoPersona = 'EMPLEADO';
    } else {
      tipoPersona = 'NEGOCIOS';
    }
    if (casados.find(item => item === localStorage.getItem('estadoCivil').toUpperCase())) {
      estadoCivil = 'CASADO';
    } else {
      estadoCivil = 'SOLTERO';
    }
    this.tipoPersona = `REQUISITOS_${tipoPersona}_${estadoCivil}_CREDICOMPRA`;
  }

  ngOnInit(): void {
    this.getInfo();
    this.solicitarCredito = localStorage.getItem('credito') !== null ? JSON.parse(localStorage.getItem('credito')) : this.inicialidarSolicitudCredito();
    // Subscribe to config changes
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });
  }

  inicialidarSolicitudCredito(): SolicitarCredito {
    return {
      _id: '',
      aceptaTerminos: 0,
      empresaComercial_id: '',
      empresaIfis_id: '',
      estado: 'Nuevo',
      monto: this.montoCreditoFinal,
      cuota: this.coutaMensual,
      plazo: 12,
      user_id: this.usuario.id,
      canal: localStorage.getItem('pagina'),
      tipoCredito: localStorage.getItem('tipoPersona') === 'Empleado' ? 'Empleado' : 'Negocio propio',
      concepto: 'Negocio propio',
      nombres: '',
      apellidos: '',
      numeroIdentificacion: '',
      user: '',
    };
  }

  getInfo() {
    this.paramService.obtenerListaPadresSinToken(this.tipoPersona).subscribe((info) => {
      this.requisitos = info[0];
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
    // this.solicitarCredito.empresaComercial_id = localStorage.getItem('pagina');
    if (localStorage.getItem('credito')) {
      this._creditosAutonomosService.updateCredito(this.solicitarCredito).subscribe((info) => {
        // localStorage.clear();
        // this._router.navigate(['/']);
      });
    } else {
      this._creditosAutonomosService.crearCredito(this.solicitarCredito).subscribe((info) => {
        // localStorage.clear();
        // this._router.navigate(['/']);
      });
    }
  }

  continue() {
    localStorage.clear();
    this._router.navigate([
      `/personas/creditos-autonomos/validacion-datos`,
    ]);
  }
}
