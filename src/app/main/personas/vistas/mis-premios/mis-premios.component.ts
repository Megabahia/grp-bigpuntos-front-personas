import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {NgbModal, NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';
import {MisPremiosService} from './mis-premios.service';
import {FlatpickrOptions} from 'ng2-flatpickr';
import moment from 'moment';
import {MisMonedasService} from '../supermonedas/mis-monedas/mis-monedas.service';
import {CoreMenuService} from '../../../../../@core/components/core-menu/core-menu.service';
import {User} from '../../../../auth/models';
import html2canvas from 'html2canvas';
import {jsPDF} from 'jspdf';
import {ParametrizacionesService} from '../../servicios/parametrizaciones.service';
import {PagarConSuperMonedasService} from '../supermonedas/pagar-con-supermonedas/pagar-con-supermonedas.service';

@Component({
    selector: 'app-mis-premios',
    templateUrl: './mis-premios.component.html',
    styleUrls: ['./mis-premios.component.scss']
})
export class MisPremiosComponent implements OnInit {
    @ViewChild(NgbPagination) paginator: NgbPagination;
    @ViewChild('comprobanteCompraSuperMonedasMdl') comprobanteCompraSuperMonedasMdl;
    @ViewChild('mensajeModal') mensajeModal;

    public usuario: User;
    public mensaje = '';

    public page = 1;
    public pageSize: any = 10;
    public maxSize;
    public collectionSize;
    public loading = false;
    public listaProductos;
    public opcionEmpresa = '';
    public tipos;
    public startDateOptions: FlatpickrOptions = {
        altInput: true,
        mode: 'single',
        altFormat: 'Y-n-j',
        altInputClass: 'form-control flat-picker flatpickr-input invoice-edit-input',
    };
    private _unsubscribeAll: Subject<any>;

    public cantidadMonedas;
    public nombreTienda;
    public direccionTienda;
    public imagenTienda;
    public monto;
    public nombreComercial;
    public pagoMonto;
    public longitudCodigoPago;

    constructor(
        private _misPremios: MisPremiosService,
        private _misMonedasService: MisMonedasService,
        private paramService: ParametrizacionesService,
        private _pagarConSuperMonedasService: PagarConSuperMonedasService,
        private _coreMenuService: CoreMenuService,
        private changeDetector: ChangeDetectorRef,
        private _modalService: NgbModal,
    ) {
        this._unsubscribeAll = new Subject();
        this.usuario = this._coreMenuService.grpPersonasUser;
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
        this.changeDetector.detectChanges();
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngAfterViewInit() {
        const semilla = JSON.parse(localStorage.getItem('semillaPago'));
        localStorage.removeItem('semillaPago');
        this.opcionEmpresa = semilla ? semilla.empresa_id : '';
        this.iniciarPaginador();
        this.obtenerListaProductos();
        this.obtenerListaEmpresasComerciales();
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    iniciarPaginador() {
        this.paginator.pageChange.subscribe(() => {
            this.obtenerListaProductos();
        });
    }

    abrirModalLg(modal) {
        this._modalService.open(modal, {
            size: 'lg',
        });
    }

    abrirModal(modal) {
        this._modalService.open(modal);
    }

    cerrarModal() {
        this._modalService.dismissAll();
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

    obtenerListaProductos() {
        this._misPremios.obtenerListaProductos(
            {
                page: this.page - 1,
                page_size: this.pageSize,
                tipo: 'producto-premios',
                empresa_id: this.opcionEmpresa,
            }
        ).subscribe((info) => {
            this.listaProductos = info.info;
            this.collectionSize = info.cont;
        });
    }

    obtenerListaEmpresasComerciales() {
        this._misPremios.obtenerListaEmpresasComerciales(
            {
                page: this.page - 1,
                page_size: this.pageSize,
                // nombre: this.nombreBuscar
            }
        ).subscribe((info) => {
            this.tipos = info.info;
            this.collectionSize = info.cont;
        });
    }

    enviarMonto(producto) {
        this.pagoMonto = this.incializarPagoMonto();
        if (producto) {
            console.log(producto);
            this.nombreTienda = producto.empresa;
            this.imagenTienda = producto.imagen_empresa;
            this.direccionTienda = producto.local;
            this.pagoMonto.monto = producto.precioSupermonedas;

            /* this._pagarConSuperMonedasService
              .imageUrlToBase64(empresa[0].imagen)
              .subscribe((base64) => {
                console.log(base64);
                this.imagenTienda = "data:image/jpeg;base64," + base64;
              }); */
        }
        if (this.cantidadMonedas < producto.precioSupermonedas) {
            this.mensaje =
                'El monto que ingreso supera su cantidad de Big Puntos, ingrese otra cantidad que disponga en su cuenta.';
            this.abrirModal(this.mensajeModal);
            return;
        }
        // Llena los datos del pago monto
        this.pagoMonto.codigoCobro = this.generarNumeros(this.longitudCodigoPago) + '-' + moment().valueOf().toString();
        this.pagoMonto.empresa_id = producto.empresa_id;
        this.pagoMonto.monto = producto.precioSupermonedas;

        this._pagarConSuperMonedasService
            .pagarConSuperMonedas(this.pagoMonto)
            .subscribe(
                (info) => {
                },
                (error) => {
                    this.mensaje = 'Ha ocurrido un error en el pago';
                    this.abrirModal(this.mensajeModal);
                }
            );
        this.abrirModalLg(this.comprobanteCompraSuperMonedasMdl);
    }

    generarNumeros(longitudCodigo) {
        return Math.floor(
            Math.pow(10, longitudCodigo - 1) +
            Math.random() *
            (Math.pow(10, longitudCodigo) - Math.pow(10, longitudCodigo - 1) - 1)
        );
    }

    exportHtmlToPDF() {
        const data = document.getElementById('print-section');

        html2canvas(data).then((canvas) => {
            const docWidth = 208;
            const docHeight = (canvas.height * docWidth) / canvas.width;

            const contentDataURL = canvas.toDataURL('image/png');
            const doc = new jsPDF('p', 'mm', 'a4');
            const position = 0;
            doc.addImage(contentDataURL, 'PNG', 0, position, docWidth, docHeight);

            doc.save('comprobante.pdf');
        });
    }
}
