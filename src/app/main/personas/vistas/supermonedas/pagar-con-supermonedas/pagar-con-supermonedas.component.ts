import {DatePipe} from '@angular/common';
import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CoreMenuService} from '@core/components/core-menu/core-menu.service';
import {NgbPagination, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {User} from 'app/auth/models';
import {Subject} from 'rxjs';
import {PagarConSuperMonedasService} from './pagar-con-supermonedas.service';
import {CoreSidebarService} from '../../../../../../@core/components/core-sidebar/core-sidebar.service';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {PagoMonto} from '../../../models/supermonedas';
import moment from 'moment';
import {MisMonedasService} from '../mis-monedas/mis-monedas.service';
import {ParametrizacionesService} from '../../../servicios/parametrizaciones.service';
import {jsPDF} from 'jspdf';
import html2canvas from 'html2canvas';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

/**
 * Bigpuntos
 * PErsonas
 * Esta pantalla sirve para pagar con super monedas
 * Rutas:
 * `${environment.apiUrl}/core/monedas/usuario/${id}`
 * `${environment.apiUrl}/central/param/list/listOne`,
 * `${environment.apiUrl}/corp/pagos/create/`,
 * `${environment.apiUrl}/corp/empresas/list/`,
 */

@Component({
    selector: 'app-pagar-con-supermonedas',
    templateUrl: './pagar-con-supermonedas.component.html',
    styleUrls: ['./pagar-con-supermonedas.component.scss'],
    providers: [DatePipe],
})
export class PagarConSuperMonedasComponent implements OnInit, OnDestroy {
    @ViewChild(NgbPagination) paginator: NgbPagination;
    @ViewChild('comprobanteCompraSuperMonedasMdl')
    comprobanteCompraSuperMonedasMdl;
    @ViewChild('finalizacionMdl')
    finalizacionMdl;
    @ViewChild('mensajeModal') mensajeModal;
    public page = 1;
    public page_size: any = 10;
    public maxSize;
    public collectionSize;
    public monedas;
    public usuario: User;
    public cantidadMonedas;
    private _unsubscribeAll: Subject<any>;
    public compraSuperMonedasForm: FormGroup;
    public cargandoCompraSupermonedas = false;
    public cobrarSuperMonedasSubmitted = false;
    public nombreTienda;
    public direccionTienda;
    public imagenTienda;
    public monto;
    public nombreComercial;
    public listaEmpresas;
    public pagoMonto: PagoMonto;
    public mensaje = '';
    public longitudCodigoPago;

    constructor(
        private _pagarConSuperMonedasService: PagarConSuperMonedasService,
        private _coreMenuService: CoreMenuService,
        private _coreSidebarService: CoreSidebarService,
        private datePipe: DatePipe,
        private _formBuilder: FormBuilder,
        private _modalService: NgbModal,
        private _misMonedasService: MisMonedasService,
        private paramService: ParametrizacionesService,
        private _router: Router,
        private toastr: ToastrService,
    ) {
        this._unsubscribeAll = new Subject();
        this.usuario = this._coreMenuService.grpPersonasUser;
        this.pagoMonto = this.incializarPagoMonto();
    }

    get cobSupForm() {
        return this.compraSuperMonedasForm.controls;
    }

    ngOnInit(): void {
        this._misMonedasService
            .obtenerCantidadMonedas(this.usuario.id)
            .subscribe((info) => {
                this.cantidadMonedas = info.saldo;
            });

        this.paramService
            .obtenerParametroNombreTipo(
                'longitud_codigo_pago',
                'LONGITUD_CODIGO_PAGO'
            )
            .subscribe((info) => {
                this.longitudCodigoPago = info.valor;
            });

        this.compraSuperMonedasForm = this._formBuilder.group({
            monto: ['', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
        });
    }

    incializarPagoMonto() {
        return {
            id: '',
            codigoCobro: '',
            monto: '',
            user_id: this.usuario.id,
            empresa_id: '',
        };
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngAfterViewInit() {
        this.iniciarPaginador();
        this.obtenerListaEmpresa();
    }

    buscarEmpresa() {
    }


    toggleSidebar(name, id): void {
        this.pagoMonto.empresa_id = id;
        const empresa = this.listaEmpresas.filter((x) => x._id === id);
        if (empresa.length) {
            this.nombreTienda = empresa[0].nombreComercial;
            this.imagenTienda = empresa[0].imagen;
            this.direccionTienda = empresa[0].direccion;

            /*this._pagarConSuperMonedasService
              .imageUrlToBase64(empresa[0].imagen)
              .subscribe((base64) => {
                console.log(base64);
                this.imagenTienda = "data:image/jpeg;base64," + base64;
              }); */
        }
        this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
    }

    enviarMonto() {
        if (this.cantidadMonedas < this.pagoMonto.monto) {
            this.mensaje =
                'El monto que ingreso supera su cantidad de Big Puntos, ingrese otra cantidad que disponga en su cuenta.';
            this.abrirModal(this.mensajeModal);
            return;
        }

        this.cobrarSuperMonedasSubmitted = true;

        // stop here if form is invalid
        if (this.compraSuperMonedasForm.invalid) {
            this.toastr.warning('Al parecer existe un error con la información que ingresó, por favor revise y vuelva a intentar.',
                'Alerta');
            return;
        }
        this.pagoMonto.codigoCobro =
            this.generarNumeros(this.longitudCodigoPago) +
            '-' +
            moment().valueOf().toString();

        this.cargandoCompraSupermonedas = true;
        this._pagarConSuperMonedasService
            .pagarConSuperMonedas(this.pagoMonto)
            .subscribe(
                (info) => {
                    this.cargandoCompraSupermonedas = false;
                },
                (error) => {
                    this.mensaje = 'Ha ocurrido un error en el pago';
                    this.abrirModal(this.mensajeModal);
                }
            );
        this.abrirModalLg(this.comprobanteCompraSuperMonedasMdl);
    }

    obtenerListaEmpresa() {
        this._pagarConSuperMonedasService
            .obtenerListaEmpresa({
                page: this.page - 1,
                page_size: this.page_size,
                nombreComercial: this.nombreComercial,
            })
            .subscribe((info) => {
                this.listaEmpresas = info.info;
                this.collectionSize = info.cont;
                const semilla = JSON.parse(localStorage.getItem('semillaPago'));
                localStorage.removeItem('semillaPago');
                if (semilla) {
                    this.toggleSidebar('guardarCompraSupermonedas', semilla.empresa_id);
                }
            });
    }

    iniciarPaginador() {
        this.paginator.pageChange.subscribe(() => {
            this.obtenerListaEmpresa();
        });
    }

    transformarFecha(fecha) {
        return this.datePipe.transform(fecha, 'yyyy-MM-dd');
    }

    abrirModalLg(modal) {
        this._modalService.open(modal, {
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
        });
    }

    abrirModal(modal) {
        this._modalService.open(modal);
    }

    cerrarModal() {
        this._modalService.dismissAll();
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    generarNumeros(longitudCodigo) {
        return Math.floor(
            Math.pow(10, longitudCodigo - 1) +
            Math.random() *
            (Math.pow(10, longitudCodigo) - Math.pow(10, longitudCodigo - 1) - 1)
        );
    }

    exportHtmlToPDF() {
        const data = document.getElementById('print-section2');
        data.style.display = 'block';

        html2canvas(data).then((canvas) => {
            const docWidth = 208;
            const docHeight = (canvas.height * docWidth) / canvas.width;

            const contentDataURL = canvas.toDataURL('image/png');
            const doc = new jsPDF('p', 'mm', 'a4');
            const position = 0;
            doc.addImage(contentDataURL, 'PNG', 0, position, docWidth, docHeight);

            doc.save('comprobante.pdf');
            data.style.display = 'none';
        });
    }

    modalFinalizar() {
        this.cerrarModal();
        // this.abrirModalLg(this.finalizacionMdl);

        this._router.navigate(['personas/BigPuntos/mis-facturas']);
    }

    cerrarModalFinalizar() {
        this.cerrarModal();
        this._router.navigate(['/personas/BigPuntos/mis-bigpuntos']);
    }
}
