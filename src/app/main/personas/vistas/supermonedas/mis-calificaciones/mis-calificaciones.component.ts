import {DatePipe} from '@angular/common';
import {Component, OnInit, ViewChild} from '@angular/core';
import {CoreSidebarService} from '@core/components/core-sidebar/core-sidebar.service';
import {NgbPagination, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';
import {MisFacturasService} from '../mis-facturas/mis-facturas.service';
import {CoreMenuService} from '../../../../../../@core/components/core-menu/core-menu.service';
import {FacturaFisica, FacturaFisicaCalificaciones, GanarSuperMoneda} from '../../../models/supermonedas';
import {Validators, FormBuilder, FormGroup} from '@angular/forms';
import {ParametrizacionesService} from '../../../servicios/parametrizaciones.service';
import {BienvenidoService} from '../../bienvenido/bienvenido.service';
import {ToastrService} from 'ngx-toastr';
import {FlatpickrOptions} from 'ng2-flatpickr';

/**
 * Bigpuntos
 * Personas
 * Esta pantalla sirve para mostrar las calificaciones
 * Rutas:
 * `${environment.apiUrl}/central/param/list/listOne`,
 * `${environment.apiUrl}/corp/empresas/listOne/filtros/`,
 * `${environment.apiUrl}/central/param/list/tipo/todos/`,
 * `${environment.apiUrl}/central/param/list/filtro/nombre`,
 * `${environment.apiUrl}/central/facturas/listOne/${id}`,
 * `${environment.apiUrl}/central/facturas/list/`,
 * `${environment.apiUrl}/central/facturas/update/${datos._id}`,
 * `${environment.apiUrl}/core/monedas/create/`,
 */

@Component({
    selector: 'app-mis-calificaciones',
    templateUrl: './mis-calificaciones.component.html',
    styleUrls: ['./mis-calificaciones.component.scss'],
    providers: [DatePipe]
})
export class MisCalificacionesComponent implements OnInit {
    @ViewChild(NgbPagination) paginator: NgbPagination;
    @ViewChild('mensajeModal') mensajeModal;
    public ganarMonedas;
    public superMonedas: GanarSuperMoneda;
    public page = 1;
    public page_size: any = 2;
    public maxSize;
    public collectionSize;
    public submittedFactura = false;
    public facturas;
    public mensaje = '';
    public usuario;
    public empresaId = '';
    public loading = false;
    public facFisiForm: FormGroup;
    public facturaFisica: FacturaFisicaCalificaciones;
    public paisOpciones;
    public provinciaOpciones;
    public ciudadOpciones;
    public imagen;
    public categoriaEmpresaOpciones;
    public startDateOptions: FlatpickrOptions = {
        altInput: true,
        mode: 'single',
        altFormat: 'Y-n-j',
        altInputClass:
            'form-control flat-picker flatpickr-input invoice-edit-input',
    };
    public fechaInicio = '';
    public fechaFin = '';

    private _unsubscribeAll: Subject<any>;

    constructor(
        private _misFacturasService: MisFacturasService,
        private datePipe: DatePipe,
        private _coreSidebarService: CoreSidebarService,
        private _coreMenuService: CoreMenuService,
        private _formBuilder: FormBuilder,
        private paramService: ParametrizacionesService,
        private _bienvenidoService: BienvenidoService,
        private modalService: NgbModal,
        private toastr: ToastrService,
    ) {
        this._unsubscribeAll = new Subject();
        this.usuario = this._coreMenuService.grpPersonasUser;

        this.facturaFisica = this.inicializarFacturaFisica();
        this.superMonedas = this.inicializarSuperMoneda();

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

    ngOnInit(): void {
        this.usuario = this._coreMenuService.grpPersonasUser;
        this.facFisiForm = this._formBuilder.group({
            razonSocial: ['', [Validators.required]],
            pais: ['', [Validators.required]],
            provincia: ['', [Validators.required]],
            ciudad: ['', [Validators.required]],
            importeTotal: [0, [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
            categoria: ['', [Validators.required]],
            atencion: ['', [Validators.required]],
            calificacion: ['', [Validators.required]],
            observaciones: ['', [Validators.required]],
        });
        this.paramService.obtenerParametroNombreTipo('monedas_calificar', 'GANAR_SUPERMONEDAS').subscribe((info) => {
            this.ganarMonedas = info;
            this.superMonedas.credito = this.ganarMonedas.valor;
            this.superMonedas.descripcion = 'Gana ' + this.ganarMonedas.valor + ' BP por calificar Factura';
        });
        this.obtenerPaisOpciones();
        this.obtenerProvinciaOpciones();
        this.obtenerCiudadOpciones();
        this.obtenerCategoriaEmpresaOpciones();
        this.obtenerEmpresaId();
    }

    obtenerEmpresaId() {
        this._bienvenidoService.obtenerEmpresa({
            nombreComercial: 'Global RedPyme'
        }).subscribe((info) => {
            this.empresaId = info._id;

        }, (error) => {
            this.mensaje = 'Ha ocurrido un error al actualizar su imagen';
            this.abrirModal(this.mensajeModal);
        });
    }

    ngAfterViewInit() {
        this.iniciarPaginador();

        this.obtenerListaFacturas();
    }

    obtenerPaisOpciones() {
        this.paramService.obtenerListaPadres('PAIS').subscribe((info) => {
            this.paisOpciones = info;
        });
    }

    obtenerProvinciaOpciones() {
        this.paramService.obtenerListaHijos(this.facturaFisica.pais, 'PAIS').subscribe((info) => {
            this.provinciaOpciones = info;
        });
    }

    obtenerCiudadOpciones() {
        this.paramService.obtenerListaHijos(this.facturaFisica.provincia, 'PROVINCIA').subscribe((info) => {
            this.ciudadOpciones = info;
        });
    }

    obtenerCategoriaEmpresaOpciones() {
        this.paramService.obtenerListaPadres('CATEGORIA_EMPRESA').subscribe((info) => {
            this.categoriaEmpresaOpciones = info;
        });
    }

    inicializarFacturaFisica(): FacturaFisicaCalificaciones {
        return {
            _id: '',
            atencion: '',
            calificacion: '',
            categoria: '',
            ciudad: '',
            importeTotal: 0,
            observaciones: '',
            pais: '',
            provincia: '',
            razonSocial: '',
            user_id: this.usuario.id,
            estado: 'Calificado'
        };
    }

    get FFForm() {
        return this.facFisiForm.controls;
    }

    toggleSidebar(name, id): void {
        if (id) {
            this._misFacturasService.obtenerFactura(id).subscribe((info) => {
                this.facturaFisica = info;
                this.imagen = info.urlFoto ? info.urlFoto : (info.urlArchivo ? info.urlArchivo : '');
                this.obtenerProvinciaOpciones();
                this.obtenerCiudadOpciones();
            });
        }

        this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
    }

    obtenerListaFacturas() {
        this._misFacturasService.obtenerFacturas({
            page: this.page - 1, page_size: this.page_size, user_id: this.usuario.id,
            inicio: this.transformarFecha(this.fechaInicio),
            fin: this.transformarFecha(this.fechaFin),
        }).subscribe(info => {
            this.facturas = info.info;
            this.collectionSize = info.cont;
        });
    }

    visualizarNombreArchivo(nombre) {
        return nombre.split('/').slice(5);
    }

    guardarFacturaFisica() {
        this.submittedFactura = true;
        if (this.facFisiForm.invalid) {
            this.toastr.warning('Al parecer existe un error con la información que ingresó, por favor revise y vuelva a intentar.',
                'Alerta');
            return;
        }

        this.loading = true;
        this.facturaFisica.estado = 'Calificado';
        this._misFacturasService.actualizarFactura(this.facturaFisica).subscribe((info) => {
                this.loading = false;

                this.obtenerListaFacturas();
                this.toggleSidebar('calificar', '');
                this.superMonedas.empresa_id = this.empresaId;
                this._bienvenidoService.guardarSuperMonedas(this.superMonedas).subscribe((infoSM) => {
                    this.loading = false;

                    this.mensaje = 'Su calificación por la compra realizada ha sido cargada con éxito. Usted ha ganado  ' + this.ganarMonedas.valor + ' Big Puntos';
                    this.abrirModal(this.mensajeModal);
                });

            },
            (error) => {
                this.loading = false;
                this.mensaje = 'Ha ocurrido un error al cargar su factura';
                this.abrirModal(this.mensajeModal);
            });
    }

    transformarFecha(fecha) {
        let nuevaFecha = this.datePipe.transform(fecha, 'yyyy-MM-dd');
        return nuevaFecha;
    }

    iniciarPaginador() {
        this.paginator.pageChange.subscribe(() => {
            this.obtenerListaFacturas();
        });
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


}
