import {DatePipe} from '@angular/common';
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {CoreMenuService} from '@core/components/core-menu/core-menu.service';
import {NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {User} from 'app/auth/models';
import {Subject} from 'rxjs';
import {MisMonedasService} from './mis-monedas.service';
import {DatatableComponent} from '@swimlane/ngx-datatable';

@Component({
    selector: 'app-mis-monedas',
    templateUrl: './mis-monedas.component.html',
    styleUrls: ['./mis-monedas.component.scss'],
    providers: [DatePipe]
})
export class MisMonedasComponent implements OnInit, AfterViewInit {
    @ViewChild(NgbPagination) paginator: NgbPagination;
    public page = 1;
    public page_size: any = 5;
    public maxSize;
    public collectionSize;
    public monedas;
    public usuario: User;
    public cantidadMonedas;
    private _unsubscribeAll: Subject<any>;

    @ViewChild('table', {static: false}) table: DatatableComponent;

    constructor(
        private _misMonedasService: MisMonedasService,
        private _coreMenuService: CoreMenuService,
        private datePipe: DatePipe
    ) {
        this._unsubscribeAll = new Subject();
        this.usuario = this._coreMenuService.grpPersonasUser;

    }

    ngOnInit(): void {
        this._misMonedasService.obtenerCantidadMonedas(this.usuario.id).subscribe(info => {
            this.cantidadMonedas = info.saldo;
        });
    }

    ngAfterViewInit() {
        // this.table.bodyHeight = 600;
        // setTimeout(() => {
        //     this.table.recalculate();
        // }, 300);
        this.iniciarPaginador();

        this.obtenerListaMonedas();
    }

    obtenerListaMonedas() {
        this._misMonedasService.obtenerListaSuperMonedas({
            page: this.page - 1, page_size: this.page_size, user_id: this.usuario.id
        }).subscribe(info => {
            this.monedas = info.info;
            console.log(info.info);
            this.collectionSize = info.cont;
        });
    }

    iniciarPaginador() {
        this.paginator.pageChange.subscribe(() => {
            this.obtenerListaMonedas();
        });
    }

    transformarFecha(fecha) {
        let nuevaFecha = this.datePipe.transform(fecha, 'yyyy-MM-dd');
        return nuevaFecha;
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
