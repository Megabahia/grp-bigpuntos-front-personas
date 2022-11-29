import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {FlatpickrOptions} from 'ng2-flatpickr';
import {CoreConfigService} from '../../../../../../@core/services/config.service';
import {ParametrizacionesService} from '../../../servicios/parametrizaciones.service';
import moment from 'moment';
import {CoreMenuService} from '../../../../../../@core/components/core-menu/core-menu.service';
import {CreditosAutonomosService} from '../creditos-autonomos.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import Decimal from 'decimal.js';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-solicitud-credito',
    templateUrl: './solicitud-credito.component.html',
    styleUrls: ['./solicitud-credito.component.scss']
})
export class SolicitudCreditoComponent implements OnInit {
    @Output() estado = new EventEmitter<number>();
    @ViewChild('modalAviso') modalAviso;

    public coreConfig: any;
    public usuario;
    public user_id;
    public personaForm: FormGroup;
    public tipoNivelInstrucciones = [];
    public tipoViviendas = [];
    public tipoPersona = [];
    public tipoParentesco = [];
    public fecha;
    public tipoIdentificacion = [];
    public menorEdad = false;
    private _unsubscribeAll: Subject<any>;
    public nombreDueno = false;
    public casado = false;
    public submittedPersona = false;
    public estadoCivilOptions = [];
    public estadoCivilStorage;
    public tipoPersonaStorage;
    public montoCreditoFinalStorage;
    public coutaMensualStorage;
    public montoInteresStorage;
    public generos = [];
    public mensaje;


    public porcentajeConyuge = 2;
    public porcentajeCapacidaPago = 0.80;
    public tasaInteres = 17;
    public tasaInteresMensual = 0.0;
    public plazo = 12;
    public montoMaximo = 2500;
    public montoMinimo = 500;


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
        private modalService: NgbModal,
    ) {
        this._unsubscribeAll = new Subject();
        this.usuario = this._coreMenuService.grpPersonasUser.persona;
        this.user_id = this._coreMenuService.grpPersonasUser.id;
        this._creditosAutonomosService.obtenerInformacion(this.user_id).subscribe((info) => {
            console.log('info', info);
            const grpPersonasUser = JSON.parse(localStorage.getItem('grpPersonasUser'));
            grpPersonasUser.persona = info;
            console.log('grpPersonasUser', grpPersonasUser);
            localStorage.setItem('grpPersonasUser', JSON.stringify(grpPersonasUser));

        });
    }

    get persForm() {
        return this.personaForm.controls;
    }

    get ocuSolicitanteForm() {
        return this.personaForm.get('ocupacionSolicitante')['controls'];
    }

    get refeSolicitanteForm() {
        return this.personaForm.controls['referenciasSolicitante'] as FormArray;
    }

    get ingreSolicitanteForm() {
        return this.personaForm.get('ingresosSolicitante')['controls'];
    }

    get gasSolicitanteForm() {
        return this.personaForm.get('gastosSolicitante')['controls'];
    }

    ngOnInit(): void {
        this.valoresLocalStorage();
        const fechaSolicitud = moment().format('L');
        this.personaForm = this._formBuilder.group({
                tipoIdentificacion: [this.usuario.tipoIdentificacion, [Validators.required]],
                tipoPersona: [this.tipoPersonaStorage, [Validators.required]],
                documento: [this.usuario.identificacion, Validators.required],
                email: [this.usuario.email],
                whatsapp: [this.usuario.whatsapp, [Validators.required,
                    Validators.maxLength(10),
                    Validators.minLength(10),
                    Validators.pattern('^[0-9]*$')]],
                celular: [this.usuario.celular, [Validators.required,
                    Validators.maxLength(10),
                    Validators.minLength(10),
                    Validators.pattern('^[0-9]*$')]],
                genero: [this.usuario.genero, Validators.required],
                edad: [this.usuario.edad],
                fechaSolicitud: [fechaSolicitud, Validators.required],
                nombres: [this.usuario.nombres, [Validators.required, Validators.minLength(4), Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ]+\\s[a-zA-ZñÑáéíóúÁÉÍÓÚ]*')]],
                apellidos: [this.usuario.apellidos, [Validators.required, Validators.minLength(4), Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ]+')]],
                fechaNacimiento: [this.usuario.fechaNacimiento, [Validators.required]],
                nivelInstruccion: [this.usuario.nivelInstruccion, Validators.required],
                tipoVivienda: [this.usuario.tipoVivienda, Validators.required],
                nombreDueno: [this.usuario.nombreDueno, [Validators.minLength(8), Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ]+\\s[a-zA-ZñÑáéíóúÁÉÍÓÚ]*')]],
                whatsappDueno: ['', [Validators.pattern('^([0-9])+$')]],
                direccionDomicilio: [this.usuario.direccionDomicilio, [Validators.required, Validators.minLength(20), Validators.pattern('[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ\\s]+')]],
                referenciaDomicilio: [this.usuario.referenciaDomicilio, Validators.required],
                estadoCivil: [this.estadoCivilStorage, Validators.required],
                ocupacionSolicitante: this._formBuilder.group({
                    nombreNegocio: ['', [Validators.required, Validators.minLength(1), Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ\\s]+')]],
                    direccionNegocio: ['', [Validators.required, Validators.minLength(20), Validators.pattern('[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ\\s]+')]],
                    tiempoTrabajo: ['', [Validators.required, Validators.pattern('^([0-9])+$')]],
                    cargoDesempeno: ['', [Validators.required, Validators.minLength(4), Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ\\s]+')]],
                    sueldoPercibe: ['', [Validators.required, Validators.pattern('^([0-9])+$')]],
                }),
                referenciasSolicitante: this._formBuilder.array([
                    this._formBuilder.group({
                        referenciaSolicitante: ['', [Validators.required]],
                        nombre: ['', [Validators.required, Validators.minLength(1), Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ\\s]+')]],
                        apellido: ['', [Validators.required, Validators.minLength(1), Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ\\s]+')]],
                        direccion: ['', [Validators.required, Validators.minLength(1), Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ0-9\\s]+')]],
                        telefono: ['', [Validators.required, Validators.pattern('^([0-9])+$')]],
                    }),
                    this._formBuilder.group({
                        referenciaSolicitante: ['', [Validators.required]],
                        nombre: ['', [Validators.required, Validators.minLength(1), Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ\\s]+')]],
                        apellido: ['', [Validators.required, Validators.minLength(1), Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ\\s]+')]],
                        direccion: ['', [Validators.required, Validators.minLength(1), Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ0-9\\s]+')]],
                        telefono: ['', [Validators.required, Validators.pattern('^([0-9])+$')]],
                    }),
                    this._formBuilder.group({
                        referenciaSolicitante: ['', [Validators.required]],
                        nombre: ['', [Validators.required, Validators.minLength(1), Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ\\s]+')]],
                        apellido: ['', [Validators.required, Validators.minLength(1), Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ\\s]+')]],
                        direccion: ['', [Validators.required, Validators.minLength(1), Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ0-9\\s]+')]],
                        telefono: ['', [Validators.required, Validators.pattern('^([0-9])+$')]],
                    })
                ]),
                ingresosSolicitante: this._formBuilder.group({
                    sueldoMensual: ['', [Validators.required, Validators.pattern('^([0-9])+$')]],
                    sueldoConyuge: ['', [Validators.pattern('^([0-9])*$')]],
                    otrosIngresos: ['', [Validators.required, Validators.pattern('^([0-9])+$')]],
                    descripcion: ['', Validators.required],
                    totalIngresos: [''],
                }),
                gastosSolicitante: this._formBuilder.group({
                    alimentacion: ['', [Validators.required, Validators.pattern('^([0-9])+$')]],
                    arriendo: ['', [Validators.required, Validators.pattern('^([0-9])+$')]],
                    vestido: ['', [Validators.required, Validators.pattern('^([0-9])+$')]],
                    trasporte: ['', [Validators.required, Validators.pattern('^([0-9])+$')]],
                    serviciosBasicos: ['', [Validators.required, Validators.pattern('^([0-9])+$')]],
                    medicina: ['', [Validators.required, Validators.pattern('^([0-9])+$')]],
                    educacion: ['', [Validators.required, Validators.pattern('^([0-9])+$')]],
                    otrosPrestamos: ['', [Validators.required, Validators.pattern('^([0-9])+$')]],
                    otrosGastos: ['', [Validators.required, Validators.pattern('^([0-9])+$')]],
                    descripcion: ['', Validators.required],
                    totalGastos: [''],
                })
            }
        );
        this.obtenerListas();
        console.log('this.usuario.', this.usuario);
        this.fecha = this.usuario.fechaNacimiento;
        this.personaForm.get('ocupacionSolicitante').patchValue(this.usuario.ocupacionSolicitante);
        this.personaForm.get('referenciasSolicitante').patchValue(this.usuario.referenciasSolicitante);
        this.personaForm.get('ingresosSolicitante').patchValue(this.usuario.ingresosSolicitante);
        this.personaForm.get('gastosSolicitante').patchValue(this.usuario.gastosSolicitante);
        this.tipoViviendaSelected();

    }

    valoresLocalStorage() {
        this.estadoCivilStorage = localStorage.getItem('estadoCivil');
        console.log('this.estadoCivilStorage', this.estadoCivilStorage);
        if (this.estadoCivilStorage === 'Casado' || this.estadoCivilStorage === 'Unión libre') {
            this.casado = true;
        } else {
            this.casado = false;
        }
        this.tipoPersonaStorage = localStorage.getItem('tipoPersona');
        this.montoCreditoFinalStorage = localStorage.getItem('montoCreditoFinal');
        this.coutaMensualStorage = localStorage.getItem('coutaMensual');
        this.montoInteresStorage = localStorage.getItem('montoInteres');
    }


    calcularEdad() {
        // console.log('--', this.personaForm.get('fechaNacimiento').value);
        const edad = moment().diff(new Date(this.personaForm.get('fechaNacimiento').value), 'years');
        // console.log('--', edad);
        this.personaForm.get('edad').patchValue(edad);
        if (edad < 18) {
            this.personaForm.get('fechaNacimiento').setErrors({valid: false});
        }
    }

    obtenerListas() {

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
        this.paramService.obtenerListaPadres('GENERO').subscribe((info) => {
            this.generos = info;
        });
        // this.tipoParentesco = ['Padre', 'Madre', 'Tío', 'Tía'];
        this.paramService.obtenerListaPadres('NIVEL_INSTRUCCION').subscribe((info) => {
            this.tipoNivelInstrucciones = info;
        });
        this.paramService.obtenerListaPadres('TIPO_PARIENTE').subscribe((info) => {
            this.tipoParentesco = info;
        });
        this.paramService.obtenerListaPadres('TIPO_VIVIENDA').subscribe((info) => {
            this.tipoViviendas = info;
        });
        this.paramService.obtenerListaPadres('ESTADO_CIVIL').subscribe((info) => {
            this.estadoCivilOptions = info;
        });
        this.paramService.obtenerListaPadres('TIPO_PERSONA').subscribe((info) => {
            this.tipoPersona = info;
        });
        this.paramService.obtenerListaPadres('TIPO_IDENTIFICACION').subscribe((info) => {
            this.tipoIdentificacion = info;
        });
        this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
            this.coreConfig = config;
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

    tipoViviendaSelected() {
        if (this.personaForm.get('tipoVivienda').value === 'Propia' || this.personaForm.get('tipoVivienda').value === '') {
            this.nombreDueno = false;
        } else {
            this.nombreDueno = true;
        }
    }

    tipoEstadocivilSelected() {
        if (this.personaForm.get('estadoCivil').value === 'Casado' || this.personaForm.get('estadoCivil').value === 'Unión libre') {
            this.casado = true;
        } else {
            this.casado = false;
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

    calculos() {
        // Total de ingresos
        let total = 0;
        let totalgastos = 0;
        for (const item in this.personaForm.get('ingresosSolicitante')['controls']) {
            if (item !== 'descripcion') {
                if (item !== 'totalIngresos') {
                    // if (item !== 'sueldoConyuge') {
                    total += parseInt((this.personaForm.get('ingresosSolicitante')['controls'][item].value) ? (this.personaForm.get('ingresosSolicitante')['controls'][item].value) : 0);
                    // }
                }
            }
        }
        this.personaForm.get('ingresosSolicitante').get('totalIngresos').setValue(total);

        for (const item in this.personaForm.get('gastosSolicitante')['controls']) {
            if (item !== 'descripcion') {
                if (item !== 'totalGastos') {
                    totalgastos += parseInt((this.personaForm.get('gastosSolicitante')['controls'][item].value) ? (this.personaForm.get('gastosSolicitante')['controls'][item].value) : 0);
                }
            }
        }
        this.personaForm.get('gastosSolicitante').get('totalGastos').setValue(totalgastos);


    }

    calcularCredito() {
        const ingresosTotal = this.personaForm.get('ingresosSolicitante')['controls']['totalIngresos'].value
            ? new Decimal(this.personaForm.get('ingresosSolicitante')['controls']['totalIngresos'].value).toNumber()
            : 0;
        const gastosTotal = this.personaForm.get('gastosSolicitante')['controls']['totalGastos'].value
            ? new Decimal(this.personaForm.get('gastosSolicitante')['controls']['totalGastos'].value).toNumber()
            : 0;
        console.log(' gastos a calcular ', gastosTotal);
        console.log(' compras a calcular ', ingresosTotal);
        console.log(' compras a conyuge ', this.personaForm.get('ingresosSolicitante')['controls']['sueldoConyuge'].value ? new Decimal(this.personaForm.get('ingresosSolicitante')['controls']['sueldoConyuge'].value).toNumber() : 0);
        // Formula para el calculo interes
        const ingresosConyuge = new Decimal((this.personaForm.get('ingresosSolicitante')['controls']['sueldoConyuge'].value ? new Decimal(this.personaForm.get('ingresosSolicitante')['controls']['sueldoConyuge'].value).toNumber() : 0) / 2);
        const ingresosMensuales = new Decimal(ingresosTotal).sub(ingresosConyuge);
        const gastosMensuales = new Decimal(gastosTotal);
        const ingresoDisponible = ingresosMensuales.add(ingresosConyuge).sub(gastosMensuales).toDecimalPlaces(2).toNumber();
        console.log('paso las solicitudes de precios', ingresosConyuge);
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
        // localStorage.setItem('estadoCivil', this.infoCreditForm.value['estadoCivil']);
        // localStorage.setItem('tipoPersona', this.infoCreditForm.value['tipoPersona']);
        // this._router.navigate(['/pages/requisitos-de-credito']);
    }

    nombreRepetido(event) {

        // console.log('--referencias', this.personaForm.get('referenciasSolicitante'));
        const referencias = this.personaForm.get('referenciasSolicitante').value;
        // console.log('--referencias', referencias);
        console.log('event', event);
        const pociconrepetida = [];
        referencias.forEach((value, index) => {
            if (event.target.value === value.nombre) {
                console.log('---iguales--', index);
                pociconrepetida.push(index);
            }
            this.personaForm.get('referenciasSolicitante')['controls'][index].get('nombre').setErrors({validoPas2: null});

        });
        if (pociconrepetida.length > 1) {

            pociconrepetida.forEach(value => {
                console.log('value', value);

                this.personaForm.get('referenciasSolicitante')['controls'][parseInt(value)].get('nombre').setErrors({validoPas2: false});
            });
        }

        // this.personaForm.get('referenciasSolicitante')['controls'][1].get('telefono').setErrors({validoPas: false});
        console.log('pociconrepetida', this.personaForm.get('referenciasSolicitante'));


    }
    apellidoRepetido(event) {

        // console.log('--referencias', this.personaForm.get('referenciasSolicitante'));
        const referencias = this.personaForm.get('referenciasSolicitante').value;
        // console.log('--referencias', referencias);
        console.log('event', event);
        const pociconrepetida = [];
        referencias.forEach((value, index) => {
            if (event.target.value === value.apellido) {
                console.log('---iguales--', index);
                pociconrepetida.push(index);
            }
            this.personaForm.get('referenciasSolicitante')['controls'][index].get('apellido').setErrors({validoPas3: true});

        });
        if (pociconrepetida.length > 1) {

            pociconrepetida.forEach(value => {
                console.log('value', value);

                this.personaForm.get('referenciasSolicitante')['controls'][parseInt(value)].get('apellido').setErrors({validoPas3: false});
            });
        }

        // this.personaForm.get('referenciasSolicitante')['controls'][1].get('telefono').setErrors({validoPas: false});
        console.log('pociconrepetida', this.personaForm.get('referenciasSolicitante'));


    }

    telefonoRepetido(event) {

        // console.log('--referencias', this.personaForm.get('referenciasSolicitante'));
        const referencias = this.personaForm.get('referenciasSolicitante').value;
        // console.log('--referencias', referencias);
        console.log('event', event);
        const pociconrepetida = [];
        referencias.forEach((value, index) => {
            if (event.target.value === value.telefono) {
                console.log('---iguales--', index);
                pociconrepetida.push(index);
            }
            this.personaForm.get('referenciasSolicitante')['controls'][index].get('telefono').setErrors({validoPas: true});

        });
        if (pociconrepetida.length > 1) {

            pociconrepetida.forEach(value => {
                console.log('value', value);
                this.personaForm.get('referenciasSolicitante')['controls'][parseInt(value)].get('telefono').setErrors({validoPas: false});
            });
        }
        // this.personaForm.get('referenciasSolicitante')['controls'][1].get('telefono').setErrors({validoPas: false});
        console.log('pociconrepetida', this.personaForm.get('referenciasSolicitante'));


    }

    continuar() {

        this.calculos();
        this.calcularCredito();
        // return;
        if (this.personaForm.value.tipoIdentificacion === 'Cédula') {
            this.validadorDeCedula(this.personaForm.value.documento);
        }
        if (this.personaForm.value.tipoIdentificacion === 'Pasaporte') {
            this.validadorDePasaporte(this.personaForm.value.documento);
        }
        this.calcularEdad();
        this.submittedPersona = true;
        if (this.personaForm.invalid) {
            console.log('no es valido', this.personaForm);
            return;
        }
        this.personaForm.value.fechaNacimiento = '' + new Date(this.personaForm.get('fechaNacimiento').value).getFullYear() + '-' + new Date(this.personaForm.get('fechaNacimiento').value).getMonth() + '-' + new Date(this.personaForm.get('fechaNacimiento').value).getDay();
        const persona = {
            identificacion: this.personaForm.get('documento').value,
            ...this.personaForm.value,
            user_id: this.user_id,
            imagen: []
        };
        const grpPersonasUser = JSON.parse(localStorage.getItem('grpPersonasUser'));
        console.log('grpPersonasUser', grpPersonasUser);
        grpPersonasUser.persona = persona;
        localStorage.setItem('grpPersonasUser', JSON.stringify(grpPersonasUser));
        console.log('----persona A GUARDAR ', persona);
        this._creditosAutonomosService.guardarInformacion(persona)
            .subscribe((info) => {
                this.estado.emit(3);

            });
    }

    abrirModalLg(modal) {
        this.modalService.open(modal, {
            size: 'lg'
        });
    }

}
