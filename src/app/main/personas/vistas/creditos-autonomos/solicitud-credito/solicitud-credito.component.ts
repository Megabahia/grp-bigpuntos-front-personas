import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FlatpickrOptions} from 'ng2-flatpickr';
import {CoreConfigService} from '../../../../../../@core/services/config.service';
import {ParametrizacionesService} from '../../../servicios/parametrizaciones.service';
import moment from 'moment';
import {CoreMenuService} from '../../../../../../@core/components/core-menu/core-menu.service';
import {CreditosAutonomosService} from '../creditos-autonomos.service';

@Component({
  selector: 'app-solicitud-credito',
  templateUrl: './solicitud-credito.component.html',
  styleUrls: ['./solicitud-credito.component.scss']
})
export class SolicitudCreditoComponent implements OnInit {
  @Output() estado = new EventEmitter<number>();

  public usuario;
  public user_id;
  public personaForm: FormGroup;
  public ocupacionSolicitanteForm: FormGroup;
  public referenciasSolicitanteForm: FormGroup;
  public ingresosSolicitanteForm: FormGroup;
  public gastosSolicitanteForm: FormGroup;
  public tipoNivelInstrucciones = [];
  public tipoViviendas = [];
  public fecha;

  public submittedPersona = false;

  public startDateOptions: FlatpickrOptions = {
    defaultDate: 'today',
    altInput: true,
    mode: 'single',
    altFormat: 'Y-n-j',
    altInputClass: 'form-control flat-picker flatpickr-input invoice-edit-input',
  };

  constructor(
    private _creditosAutonomosService: CreditosAutonomosService,
    private paramService: ParametrizacionesService,
    private _coreMenuService: CoreMenuService,
    private _coreConfigService: CoreConfigService,
    private _formBuilder: FormBuilder,
  ) {
    this.usuario = this._coreMenuService.grpPersonasUser.persona;
    this.user_id = this._coreMenuService.grpPersonasUser.id;
  }

  get persForm() {
    return this.personaForm.controls;
  }

  get ocuSolicitanteForm() {
    return this.ocupacionSolicitanteForm.controls;
  }

  get refeSolicitanteForm() {
    return this.referenciasSolicitanteForm.controls;
  }

  get ingreSolicitanteForm() {
    return this.ingresosSolicitanteForm.controls;
  }

  get gasSolicitanteForm() {
    return this.gastosSolicitanteForm.controls;
  }

  ngOnInit(): void {
    const fechaSolicitud = moment().format('L');

    this.personaForm = this._formBuilder.group({
      fechaSolicitud: [fechaSolicitud, Validators.required],
      nombres: [this.usuario.nombres, Validators.required],
      apellidos: [this.usuario.apellidos, Validators.required],
      fechaNacimiento: [this.usuario.fechaNacimiento, Validators.required],
      identificacion: [this.usuario.identificacion, Validators.required],
      nivelInstruccion: [this.usuario.nivelInstruccion, Validators.required],
      tipoVivienda: [this.usuario.tipoVivienda, Validators.required],
      nombreDueno: [this.usuario.nombreDueno, Validators.required],
      direccionDomicilio: [this.usuario.direccionDomicilio, Validators.required],
      referenciaDomicilio: [this.usuario.referenciaDomicilio, Validators.required],
    });
    this.ocupacionSolicitanteForm = this._formBuilder.group({
      nombreNegocio: ['', Validators.required],
      direccionNegocio: ['', Validators.required],
      tiempoTrabajo: ['', Validators.required],
      cargoDesempeno: ['', Validators.required],
      sueldoPercibe: ['', Validators.required],
    });
    this.referenciasSolicitanteForm = this._formBuilder.group({
      referenciaSolicitante: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
    });
    this.ingresosSolicitanteForm = this._formBuilder.group({
      sueldoMensual: ['', Validators.required],
      sueldoConyuge: ['', Validators.required],
      otrosIngresos: ['', Validators.required],
      descripcion: ['', Validators.required],
    });
    this.gastosSolicitanteForm = this._formBuilder.group({
      alimentacion: ['', Validators.required],
      arriendo: ['', Validators.required],
      vestido: ['', Validators.required],
      trasporte: ['', Validators.required],
      serviciosBasicos: ['', Validators.required],
      medicina: ['', Validators.required],
      educacion: ['', Validators.required],
      otrosPrestamos: ['', Validators.required],
      otrosGastos: ['', Validators.required],
      descripcion: ['', Validators.required],
    });
    this.obtenerListas();
    this.ocupacionSolicitanteForm.patchValue(JSON.parse(this.usuario.ocupacionSolicitante));
    this.referenciasSolicitanteForm.patchValue(JSON.parse(this.usuario.referenciasSolicitante));
    this.ingresosSolicitanteForm.patchValue(JSON.parse(this.usuario.ingresosSolicitante));
    this.gastosSolicitanteForm.patchValue(JSON.parse(this.usuario.gastosSolicitante));
  }

  obtenerFecha() {
    this.personaForm.controls['date'].setValue(this.fecha[0]);
  }

  obtenerListas() {
    this.paramService.obtenerListaPadres('NIVEL_INSTRUCCION').subscribe((info) => {
      this.tipoNivelInstrucciones = info;
    });
    this.paramService.obtenerListaPadres('TIPO_VIVIENDA').subscribe((info) => {
      this.tipoViviendas = info;
    });
  }

  continuar() {
    this.submittedPersona = true;

    if (this.personaForm.invalid) {
      return;
    }
    const persona = {
      ...this.personaForm.value,
      ocupacionSolicitante: JSON.stringify({...this.ocupacionSolicitanteForm.value}),
      referenciasSolicitante: JSON.stringify({...this.referenciasSolicitanteForm.value}),
      ingresosSolicitante: JSON.stringify({...this.ingresosSolicitanteForm.value}),
      gastosSolicitante: JSON.stringify({...this.gastosSolicitanteForm.value}),
      user_id: this.user_id,
      imagen: []
    };
    console.log(persona);
    this._creditosAutonomosService.guardarInformacion(persona)
      .subscribe((info) => {
        this.estado.emit(3);
      });
  }

}
