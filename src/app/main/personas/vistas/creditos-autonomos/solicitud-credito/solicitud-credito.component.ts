import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FlatpickrOptions} from 'ng2-flatpickr';
import {CoreConfigService} from '../../../../../../@core/services/config.service';
import {ParametrizacionesService} from '../../../servicios/parametrizaciones.service';
import moment from 'moment';
import {CoreMenuService} from '../../../../../../@core/components/core-menu/core-menu.service';
import {CreditosAutonomosService} from '../creditos-autonomos.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
    selector: 'app-solicitud-credito',
    templateUrl: './solicitud-credito.component.html',
    styleUrls: ['./solicitud-credito.component.scss']
})
export class SolicitudCreditoComponent implements OnInit {
    @Output() estado = new EventEmitter<number>();
    public coreConfig: any;
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
    public tipoIdentificacion = [];
    public menorEdad = false;
    private _unsubscribeAll: Subject<any>;

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
        this._unsubscribeAll = new Subject();
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
        // this.paramService.obtenerListaPadres('GENERO').subscribe((info) => {
        //     this.generos = info;
        // });
        this.paramService.obtenerListaPadres('TIPO_IDENTIFICACION').subscribe((info) => {
            this.tipoIdentificacion = info;
        });
        this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
            this.coreConfig = config;
        });
        const fechaSolicitud = moment().format('L');

        this.personaForm = this._formBuilder.group({
                tipoIdentificacion: ['', [Validators.required]],
                documento: [this.usuario.identificacion, Validators.required],
                fechaSolicitud: [fechaSolicitud, Validators.required],
                nombres: ['', [Validators.required, Validators.pattern('^([A-Za-z]){4,25}$')]],
                apellidos: ['', [Validators.required, Validators.pattern('^([A-Za-z]){4,25}$')]],
                fechaNacimiento: [Validators.required],
                nivelInstruccion: [this.usuario.nivelInstruccion, Validators.required],
                tipoVivienda: [this.usuario.tipoVivienda, Validators.required],
                nombreDueno: [this.usuario.nombreDueno, Validators.required],
                direccionDomicilio: [this.usuario.direccionDomicilio, Validators.required],
                referenciaDomicilio: [this.usuario.referenciaDomicilio, Validators.required],
                estadoCivil: [this.usuario.estadoCivil],
            }
        );
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
        this.ocupacionSolicitanteForm.patchValue(this.usuario.ocupacionSolicitante);
        this.referenciasSolicitanteForm.patchValue(this.usuario.referenciasSolicitante);
        this.ingresosSolicitanteForm.patchValue(this.usuario.ingresosSolicitante);
        this.gastosSolicitanteForm.patchValue(this.usuario.gastosSolicitante);
    }


    calcularEdad() {
        const edad = moment().diff(this.persForm.fechaNacimiento.value[0], 'years');
        console.log('edad', edad);
        let valido = false;
        if (edad < 18) {
            valido = true;
            this.personaForm.get('fechaNacimiento').setErrors({valid: false});

            console.log('menor de edad', valido);
        }
    }

    obtenerListas() {
        this.paramService.obtenerListaPadres('NIVEL_INSTRUCCION').subscribe((info) => {
            this.tipoNivelInstrucciones = info;
        });
        this.paramService.obtenerListaPadres('TIPO_VIVIENDA').subscribe((info) => {
            this.tipoViviendas = info;
        });
    }

    validadorDeCedula(cedula: String) {
        let cedulaCorrecta = false;
        if (cedula.length === 10) {
            const tercerDigito = parseInt(cedula.substring(2, 3), 10);
            if (tercerDigito < 6) {
                // El ultimo digito se lo considera dígito verificador
                const coefValCedula = [2, 1, 2, 1, 2, 1, 2, 1, 2];
                const verificador = parseInt(cedula.substring(9, 10), 10);
                let suma = 0;
                let digito = 0;
                for (let i = 0; i < (cedula.length - 1); i++) {
                    digito = parseInt(cedula.substring(i, i + 1), 10) * coefValCedula[i];
                    suma += ((parseInt((digito % 10) + '', 10) + (parseInt((digito / 10) + '', 10))));
                }
                suma = Math.round(suma);
                if ((Math.round(suma % 10) === 0) && (Math.round(suma % 10) === verificador)) {
                    cedulaCorrecta = true;
                } else if ((10 - (Math.round(suma % 10))) === verificador) {
                    cedulaCorrecta = true;
                } else {
                    cedulaCorrecta = false;
                }
            } else {
                cedulaCorrecta = false;
            }
        } else {
            cedulaCorrecta = false;
        }
        if (!cedulaCorrecta) {
            this.personaForm.get('documento').setErrors({valido: cedulaCorrecta});
        }
    }

    validadorDePasaporte(pasaporte: String) {
        const ExpRegNumDec = '^([A-Za-z0-9]){4,25}$';
        if (pasaporte.match(ExpRegNumDec) != null) {
            // console.log(' Válido');
        }
        if (pasaporte.match(ExpRegNumDec) == null) {
            // console.log('Invalido');
            this.personaForm.get('documento').setErrors({validoPas: false});
        }
    }

    continuar() {
        if (this.personaForm.value.tipoIdentificacion === 'Cédula') {
            this.validadorDeCedula(this.personaForm.value.documento);
        }
        if (this.personaForm.value.tipoIdentificacion === 'Pasaporte') {
            this.validadorDePasaporte(this.personaForm.value.documento);
        }
        this.calcularEdad();
        this.submittedPersona = true;
        if (this.personaForm.invalid) {
            return;
        }
        console.log('this.personaForm.value', (new Date(this.personaForm.value.fechaNacimiento)).getFullYear());
        this.personaForm.value.fechaNacimiento = '' + new Date(this.personaForm.value.fechaNacimiento).getFullYear() + '-' + new Date(this.personaForm.value.fechaNacimiento).getMonth() + '-' + new Date(this.personaForm.value.fechaNacimiento).getDay();
        const persona = {
            ...this.personaForm.value,
            ocupacionSolicitante: JSON.stringify({...this.ocupacionSolicitanteForm.value}),
            referenciasSolicitante: JSON.stringify({...this.referenciasSolicitanteForm.value}),
            ingresosSolicitante: JSON.stringify({...this.ingresosSolicitanteForm.value}),
            gastosSolicitante: JSON.stringify({...this.gastosSolicitanteForm.value}),
            user_id: this.user_id,
            imagen: []
        };
        this._creditosAutonomosService.guardarInformacion(persona)
            .subscribe((info) => {
                console.log('guardo');
                this.estado.emit(3);
            });
    }

}
