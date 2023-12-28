import {DatePipe} from '@angular/common';
import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CoreMenuService} from '@core/components/core-menu/core-menu.service';
import {NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {User} from 'app/auth/models';
import {Subject} from 'rxjs';
import {MonedasOtorgadasService} from './monedas-otorgadas.service';
import {ParametrizacionesService} from '../../../servicios/parametrizaciones.service';

/**
 * Bigpuntos
 * Personas
 * ESta pantalla sirve para mostrar las monedas otorgadas
 * Rutas:
 * `${environment.apiUrl}/central/param/list/listOne`,
 * `${environment.apiUrl}/core/monedas/list/otorgadas/`,
 * `${environment.apiUrl}/corp/empresas/list/logos`,
 */

@Component({
    selector: 'app-monedas-otorgadas',
    templateUrl: './monedas-otorgadas.component.html',
    styleUrls: ['./monedas-otorgadas.component.scss'],
    providers: [DatePipe]

})
export class MonedasOtorgadasComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(NgbPagination) paginator: NgbPagination;
    public page = 1;
    public page_size: any = 2;
    public maxSize;
    public collectionSize;
    public monedas;
    public imagenes;
    public usuario: User;
    public ganarMonedas;
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _monedasOtorgadasService: MonedasOtorgadasService,
        private _coreMenuService: CoreMenuService,
        private datePipe: DatePipe,
        private paramService: ParametrizacionesService,
    ) {
        this._unsubscribeAll = new Subject();
        this.usuario = this._coreMenuService.grpPersonasUser;
    }

    ngOnInit(): void {
        this.paramService.obtenerParametroNombreTipo('monedas_compra', 'GANAR_SUPERMONEDAS').subscribe((info) => {
            this.ganarMonedas = info;
        });
    }

    ngAfterViewInit() {
        this.iniciarPaginador();
        this.obtenerListaMonedas();
        this.obtenerListaImagenes();
    }

    obtenerListaMonedas() {
        this._monedasOtorgadasService.obtenerListaMonedas({
            page: this.page - 1, page_size: this.page_size, user_id: this.usuario.id
        }).subscribe(info => {
            this.monedas = info.info;
            this.collectionSize = info.cont;
        });
    }

    obtenerListaImagenes() {
        this._monedasOtorgadasService.obtenerListaImagenesEmpresas({
            page: this.page - 1, page_size: this.page_size
        }).subscribe(info => {
            this.imagenes = info.info;
        });
    }

    iniciarPaginador() {
        this.paginator.pageChange.subscribe(() => {
            this.obtenerListaMonedas();
        });
    }

    transformarFecha(fecha) {
        return this.datePipe.transform(fecha, 'yyyy-MM-dd');
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

}
