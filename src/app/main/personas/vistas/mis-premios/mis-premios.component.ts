import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';
import {MisPremiosService} from './mis-premios.service';
import {FlatpickrOptions} from 'ng2-flatpickr';

@Component({
    selector: 'app-mis-premios',
    templateUrl: './mis-premios.component.html',
    styleUrls: ['./mis-premios.component.scss']
})
export class MisPremiosComponent implements OnInit {
    @ViewChild(NgbPagination) paginator: NgbPagination;
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

    constructor(
        private _misPremios: MisPremiosService,
        private changeDetector: ChangeDetectorRef,
    ) {
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
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

}
