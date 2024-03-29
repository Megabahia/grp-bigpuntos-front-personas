import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {BienvenidoService} from '../bienvenido/bienvenido.service';
import {takeUntil} from 'rxjs/operators';
import {CompletarPerfilService} from './completar-perfil.service';
import {FlatpickrOptions} from 'ng2-flatpickr';
import {CoreConfigService} from '../../../../../@core/services/config.service';
import {CoreMenuService} from '../../../../../@core/components/core-menu/core-menu.service';
import {CompletarPerfil} from '../../models/persona';
import moment from 'moment';
import {User} from '../../../../auth/models/user';
import {GanarSuperMoneda} from '../../models/supermonedas';
import {ParametrizacionesService} from '../../servicios/parametrizaciones.service';
import {ToastrService} from 'ngx-toastr';
import {ValidacionesPropias} from '../../../../../utils/customer.validators';

/**
 * Bigpuntos
 * PErsonas
 * Esta pantalla sirve para mostrar el perfil del usuario
 * Rutas:
 * `${environment.apiUrl}/personas/personas/listOne/${id}`,
 * `${environment.apiUrl}/central/param/list/listOne`,
 * `${environment.apiUrl}/central/param/list/tipo/todos/`,
 * `${environment.apiUrl}/corp/empresas/listOne/filtros/`,
 * `${environment.apiUrl}/personas/personas/update/imagen/${id}`,
 * `${environment.apiUrl}/personas/personas/update/${datos.user_id}`,
 * `${environment.apiUrl}/central/usuarios/update/${datos.id}`,
 * `${environment.apiUrl}/personas/personas/validarCodigo/`,
 * `${environment.apiUrl}/core/monedas/create/`,
 */

@Component({
    selector: 'app-completar-perfil',
    templateUrl: './completar-perfil.component.html',
    styleUrls: ['./completar-perfil.component.scss']
})
export class CompletarPerfilComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('startDatePicker') startDatePicker;
    @ViewChild('whatsapp') whatsapp;
    @ViewChild('mensajeModal') mensajeModal;
    public empresaId = '';

    public error;
    public informacion: CompletarPerfil;
    public coreConfig: any;
    public imagen;
    public superMonedas: GanarSuperMoneda;
    public ganarMonedas;
    public mensaje = '';
    public registerForm: FormGroup;
    public loading = false;
    public submitted = false;
    public usuario: User;
    public startDateOptions: FlatpickrOptions = {
        altInput: true,
        mode: 'single',
        altFormat: 'Y-n-j',
        altInputClass: 'form-control flat-picker flatpickr-input invoice-edit-input',
    };
    public tipoIdentificacion = [];
    public generos = [];
    public codigo;
    public fecha;
    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _coreConfigService: CoreConfigService,
        private _coreMenuService: CoreMenuService,
        private _completarPerfilService: CompletarPerfilService,
        private _bienvenidoService: BienvenidoService,
        private _router: Router,
        private _formBuilder: FormBuilder,
        private modalService: NgbModal,
        private paramService: ParametrizacionesService,
        private toastr: ToastrService,
    ) {

        this.usuario = this._coreMenuService.grpPersonasUser;
        if (this.usuario.estado === '5') {
            this._router.navigate(['/personas/inicio']);
        }
        this.superMonedas = this.inicializarSuperMoneda();

        this.informacion = {
            apellidos: '',
            user_id: '',
            edad: 0,
            fechaNacimiento: '',
            genero: '',
            identificacion: '',
            nombres: '',
            whatsapp: ''
        };
        this._unsubscribeAll = new Subject();

        // Configure the layout
        this._coreConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                },
                menu: {
                    hidden: true
                },
                customizer: false,
                enableLocalStorage: false
            }
        };
    }

    // Lifecycle Hooks
    // -----------------------------------------------------------------------------------------------------
    get f() {
        return this.registerForm.controls;
    }

    inicializarSuperMoneda(): GanarSuperMoneda {
        return {
            credito: 0,
            descripcion: '',
            tipo: 'Recompensa',
            user_id: this.usuario.id,
            empresa_id: this.empresaId
        };
    }

    /**
     * On init
     */
    ngOnInit(): void {
        this.obtenerEmpresaId();
        this.registerForm = this._formBuilder.group({
            tipoIdentificacion: ['', [Validators.required]],
            documento: ['', [Validators.required]],
            nombres: ['', [Validators.required, Validators.minLength(4), Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ]+\\s[a-zA-ZñÑáéíóúÁÉÍÓÚ]+')]],
            apellidos: ['', [Validators.required, Validators.minLength(4), Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ]+\\s[a-zA-ZñÑáéíóúÁÉÍÓÚ]+')]],
            genero: ['', Validators.required],
            fechaNacimiento: ['', Validators.required],
            edad: ['', Validators.required],
            whatsapp: ['', [Validators.required,
                Validators.maxLength(10),
                Validators.minLength(10),
                Validators.pattern('^09\\d{8}$')]
            ],
            celular: ['', [Validators.required,
                Validators.maxLength(10),
                Validators.minLength(10),
                Validators.pattern('^09\\d{8}$')]
            ]
        });
        // Subscribe to config changes
        this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
            this.coreConfig = config;
        });
        this._completarPerfilService.obtenerInformacion(this.usuario.id).subscribe(info => {
            this.fecha = info.fechaNacimiento;
            this.imagen = info.imagen;
            this.registerForm.patchValue({
                tipoIdentificacion: info.tipoIdentificacion,
                documento: info.identificacion,
                nombres: info.nombres,
                apellidos: info.apellidos,
                genero: info.genero,
                fechaNacimiento: info.fechaNacimiento,
                edad: info.edad,
                whatsapp: info.whatsapp ? info.whatsapp.replace('+593', '0') : '',
                celular: info.celular ? info.celular.replace('+593', '0') : info.telefono.replace('+593', '0'),
            });
        });
        this.paramService.obtenerParametroNombreTipo('monedas_registro', 'GANAR_SUPERMONEDAS').subscribe((info) => {
            this.ganarMonedas = info;
            this.superMonedas.credito = this.ganarMonedas.valor;
            this.superMonedas.descripcion = 'Gana ' + this.ganarMonedas.valor + ' BP por completar perfil';
        });
        this.paramService.obtenerListaPadres('GENERO').subscribe((info) => {
            this.generos = info;
        });
        this.paramService.obtenerListaPadres('TIPO_IDENTIFICACION').subscribe((info) => {
            this.tipoIdentificacion = info;
        });

    }

    obtenerEmpresaId() {
        this._bienvenidoService.obtenerEmpresa({
            nombreComercial: 'Global RedPyme'
        }).subscribe((info) => {
            this.superMonedas.empresa_id = info._id;
        }, (error) => {
            this.mensaje = 'Ha ocurrido un error al actualizar su imagen';
            this.abrirModal(this.mensajeModal);
        });
    }

    ngAfterViewInit(): void {
        if (this.usuario.estado === '3') {
            this.modalWhatsapp(this.whatsapp);
        }
    }

    subirImagen(event: any) {
        if (event.target.files && event.target.files[0]) {
            const nuevaImagen = event.target.files[0];


            const imagen = new FormData();
            imagen.append('imagen', nuevaImagen, nuevaImagen.name);
            this._completarPerfilService.subirImagenRegistro(this.usuario.id, imagen).subscribe((info) => {
                    const reader = new FileReader();

                    reader.onload = (event: any) => {
                        this.imagen = event.target.result;
                    };

                    reader.readAsDataURL(event.target.files[0]);
                    this.mensaje = 'Imagen actualizada con éxito';
                    this.abrirModal(this.mensajeModal);
                },
                (error) => {
                    this.mensaje = 'Ha ocurrido un error al actualizar su imagen';
                    this.abrirModal(this.mensajeModal);
                });
        }
    }

    calcularEdad() {
        this.informacion.edad = moment().diff(this.f.fechaNacimiento.value[0], 'years');
        this.informacion.fechaNacimiento = moment(this.f.fechaNacimiento.value[0]).format('YYYY-MM-DD');
        this.registerForm.patchValue({
            edad: this.informacion.edad
        });
        if (this.informacion.edad < 18) {
            this.registerForm.get('edad').setErrors({valid: false});
        }
    }

    guardarRegistro() {
        let wppAux = '';
        this.obtenerTipoIdentificacion();

        this.submitted = true;
        // stop here if form is invalid
        if (this.registerForm.invalid) {
            this.toastr.warning('Al parecer existe un error con la información que ingresó, por favor revise y vuelva a intentar.',
                'Alerta');
            return;
        }
        this.informacion.tipoIdentificacion = this.registerForm.get('tipoIdentificacion').value;
        this.informacion.celular = this.f.celular.value;
        this.informacion.apellidos = this.f.apellidos.value;
        this.informacion.edad = this.f.edad.value;
        // this.informacion.fechaNacimiento = this.f.fechaNacimiento.value;;
        this.informacion.genero = this.f.genero.value;
        this.informacion.identificacion = this.f.documento.value;
        this.informacion.nombres = this.f.nombres.value;
        this.informacion.whatsapp = this.f.whatsapp.value;
        wppAux += '+593' + this.f.whatsapp.value.substring(1, 10);
        this.informacion.whatsapp = wppAux;
        this.informacion.user_id = this.usuario.id;
        const letrasNombre = this.informacion.nombres.toUpperCase().substring(0, 2);
        const numerosCedula = this.informacion.identificacion.substring(0, 5);
        const letrasApellido = this.informacion.apellidos.toUpperCase().substring(0, 2);
        this.informacion.codigoUsuario = letrasNombre + numerosCedula + letrasApellido;

        this._completarPerfilService.guardarInformacion(this.informacion).subscribe(info => {
                this._bienvenidoService.cambioDeEstado(
                    {
                        estado: '3',
                        id: this.usuario.id
                    }
                ).subscribe(infoCambio => {
                        this.usuario.estado = '3';
                        this.usuario.persona = info;
                        if (info.error) {
                            this.mensaje = 'Ha ocurrido un error: ' + info?.error;
                            this.abrirModal(this.mensajeModal);
                            return;
                        }
                        localStorage.setItem('grpPersonasUser', JSON.stringify(this.usuario));
                        this.modalWhatsapp(this.whatsapp);
                    },
                    (error) => {
                        this.mensaje = 'Ha ocurrido un error ';
                        this.abrirModal(this.mensajeModal);
                    });
            },
            (error) => {
                this.mensaje = 'Ha ocurrido un error al guardar la información';
                this.abrirModal(this.mensajeModal);
            });


    }

    modalWhatsapp(modalVC) {
        this.modalService.open(modalVC);
    }

    omitirContinuar() {
        const usuario = this._coreMenuService.grpPersonasUser;
        this._bienvenidoService.cambioDeEstado(
            {
                estado: '6',
                id: usuario.id
            }
        ).subscribe((info) => {
            usuario.estado = '6';
            localStorage.setItem('grpPersonasUser', JSON.stringify(usuario));
            setTimeout(() => {
                const simulador = localStorage.getItem('simulador');
                if (simulador === 'ok') {
                    this._router.navigate(['/personas/creditos-autonomos/solicitar-credito']);
                } else {
                    this._router.navigate(['/']);
                }
            }, 100);
        });
        // Login
        this.loading = true;

        // redirect to home page
    }

    validarWhatsapp() {
        this._completarPerfilService.validarWhatsapp({
            user_id: this.usuario.id,
            codigo: this.codigo
        }).subscribe(info => {
            if (info.message) {
                this._bienvenidoService.cambioDeEstado(
                    {
                        estado: '4',
                        id: this.usuario.id
                    }
                ).subscribe(infoCambio => {
                    this._bienvenidoService.guardarSuperMonedas(this.superMonedas).subscribe((infoSM) => {
                        },
                        (error) => {
                            this.mensaje = 'Ha ocurrido un error';
                            this.abrirModal(this.mensajeModal);
                        });
                    this.usuario.estado = '4';
                    localStorage.setItem('grpPersonasUser', JSON.stringify(this.usuario));
                    this.modalService.dismissAll();
                    setTimeout(() => {
                        const simulador = localStorage.getItem('simulador');
                        if (simulador === 'ok') {
                            this._router.navigate(['/personas/creditos-autonomos/solicitar-credito']);
                        } else {
                            this._router.navigate(['/']);
                        }
                    }, 100);
                });

            }
        }, error => {
            this.error = 'Hay un fallo al tratar de verificar su código, intentelo nuevamente';
        });
    }

    validadorDePasaporte(pasaporte: String) {
        const ExpRegNumDec = '^([A-Za-z0-9]){4,25}$';
        if (pasaporte.match(ExpRegNumDec) != null) {
            // console.log(' Válido');
        }
        if (pasaporte.match(ExpRegNumDec) == null) {
            // console.log('Invalido');
            this.registerForm.get('documento').setErrors({validoPas: false});
        }
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
            this.registerForm.get('documento').setErrors({valido: cedulaCorrecta});
        }
    }


    abrirModal(modal) {
        this.modalService.open(modal);
    }

    cerrarModal() {
        this.modalService.dismissAll();
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    obtenerTipoIdentificacion() {
        if (this.registerForm.value.tipoIdentificacion === 'Ruc') {
            this.registerForm.get('documento').setValidators(
                [Validators.required, ValidacionesPropias.rucValido]
            );
            this.registerForm.get('documento').updateValueAndValidity();
        } else {
            this.registerForm.get('documento').setValidators(
                [Validators.required, ValidacionesPropias.cedulaValido]
            );
            this.registerForm.get('documento').updateValueAndValidity();
        }
    }
}
