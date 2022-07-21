import {Component, OnInit, ViewChild, Output, EventEmitter, Input} from '@angular/core';
import {Subject} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {takeUntil} from 'rxjs/operators';
import {FlatpickrOptions} from 'ng2-flatpickr';
import {CoreConfigService} from '../../../../../../@core/services/config.service';
import {DomSanitizer} from '@angular/platform-browser';
import {CreditosAutonomosService} from '../creditos-autonomos.service';
import {EmpresaInformacion} from 'app/main/personas/models/empresa';
import {ParametrizacionesService} from '../../../servicios/parametrizaciones.service';


@Component({
    selector: 'app-establecimiento-seleccionado-aut',
    templateUrl: './establecimiento-seleccionado.component.html',
    styleUrls: ['./establecimiento-seleccionado.component.scss']
})
export class EstablecimientoSeleccionadoAutComponent implements OnInit {
    @Output() estado = new EventEmitter<number>();
    @Output() valores = new EventEmitter<Object>();
    @Input() idEmpresa;
    @ViewChild('startDatePicker') startDatePicker;
    @ViewChild('whatsapp') whatsapp;
    public error;
    // public informacion: CompletarPerfil;
    public coreConfig: any;
    public imagen;
    public solicitarForm: FormGroup;
    public loading = false;
    public submittedSolicitar = false;
    public empresa: EmpresaInformacion;
    public plazos = {
        plazos: []
    };
    public monto;
    public plazo = '';
    public aceptarTerminos = false;
    // public usuario: User;
    public startDateOptions: FlatpickrOptions = {
        altInput: true,
        mode: 'single',
        altFormat: 'Y-n-j',
        altInputClass: 'form-control flat-picker flatpickr-input invoice-edit-input',
    };
    public codigo;
    public fecha;
    // Private
    private _unsubscribeAll: Subject<any>;
    public video;

    /**
     * Constructor
     *
     * @param {CoreConfigService} _coreConfigService
     */
    constructor(
        private _coreConfigService: CoreConfigService,
        private sanitizer: DomSanitizer,
        private _creditosAutonomosService: CreditosAutonomosService,
        private paramService: ParametrizacionesService,
        private _router: Router,
        private _formBuilder: FormBuilder,
        private modalService: NgbModal
    ) {
        this.video = {
            url: 'https://www.youtube.com/embed/aK52RxV2XuI'
        };
        this.empresa = this.inicializarEmpresa();
        this._unsubscribeAll = new Subject();

        // Configure the layout
    }

    // Lifecycle Hooks
    // -----------------------------------------------------------------------------------------------------
    get soliForm() {
        return this.solicitarForm.controls;
    }

    /**
     * On init
     */
    inicializarEmpresa(): EmpresaInformacion {
        return {
            _id: '',
            ciudad: '',
            correo: '',
            direccion: '',
            nombreComercial: '',
            nombreEmpresa: '',
            pais: '',
            provincia: '',
            ruc: '',
            telefono1: '',
            telefono2: '',
            tipoCategoria: '',
            tipoEmpresa: '',
            imagen: '',
        };
    }

    ngOnInit(): void {

        // this.usuario = this._coreMenuService.grpPersonasUser;

        this.solicitarForm = this._formBuilder.group({
            monto: [0, [Validators.required]],
            plazo: ['', [Validators.required]],
        });
        // Subscribe to config changes
        this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
            this.coreConfig = config;
        });
    }

    ngAfterViewInit(): void {
        this._creditosAutonomosService.obtenerEmpresa(this.idEmpresa)
            .subscribe((info) => {
                this.empresa = info;
            });
        this.obtenerCategoriaEmpresaOpciones();
    }

    obtenerCategoriaEmpresaOpciones() {
        this.paramService.obtenerParametroNombreTipo('Plazos', 'CREDITOS').subscribe((info) => {
            if (info.config) {
                this.plazos = JSON.parse(JSON.parse(JSON.stringify(info.config)));
            }
        });
    }

    subirImagen(event: any) {
        if (event.target.files && event.target.files[0]) {
            const nuevaImagen = event.target.files[0];

            const reader = new FileReader();

            reader.onload = (event: any) => {
                this.imagen = event.target.result;
            };

            reader.readAsDataURL(event.target.files[0]);
            const imagen = new FormData();
            imagen.append('imagen', nuevaImagen, nuevaImagen.name);
            // this._creditosAutonomosService.subirImagenRegistro(this.usuario.id, imagen).subscribe((info) => {
            // });
        }
    }

    obtenerURL() {
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.video.url);
    }

    calcularEdad() {
        // this.informacion.edad = moment().diff(this.f.fechaNacimiento.value[0], 'years');
        // this.informacion.fechaNacimiento = moment(this.f.fechaNacimiento.value[0]).format('YYYY-MM-DD');
        // this.solicitarForm.patchValue({
        //   edad: this.informacion.edad
        // });
    }

    guardarRegistro() {
        this.submittedSolicitar = true;
        // stop here if form is invalid
        if (this.solicitarForm.invalid) {
            return;
        }
    }

    modalWhatsapp(modalVC) {
        this.modalService.open(modalVC);
    }

    async continuar() {
        this.submittedSolicitar = true;
        if (this.solicitarForm.invalid || !this.aceptarTerminos) {
            return;
        }
        await this.valores.emit({
            monto: this.monto,
            plazo: this.plazo,
            aceptaTerminos: this.aceptarTerminos,
        });
        this.estado.emit(5);
    }

    atras() {
        this.estado.emit(3);
    }

    /**
     * On destroy
     */
    // tslint:disable-next-line:use-life-cycle-interface
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
