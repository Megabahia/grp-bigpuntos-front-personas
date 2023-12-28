import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {User} from '../../../../auth/models';
import {Subject} from 'rxjs';
import {MonedasOtorgadasService} from '../supermonedas/monedas-otorgadas/monedas-otorgadas.service';
import {CoreMenuService} from '../../../../../@core/components/core-menu/core-menu.service';
import {DatePipe} from '@angular/common';
import {ParametrizacionesService} from '../../servicios/parametrizaciones.service';
import {MisComisionesService} from './mis-comisiones.service';

@Component({
  selector: 'app-mis-comisiones',
  templateUrl: './mis-comisiones.component.html',
  styleUrls: ['./mis-comisiones.component.scss']
})
export class MisComisionesComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(NgbPagination) paginator: NgbPagination;
  public page = 1;
  public page_size: any = 2;
  public maxSize;
  public collectionSize;
  public monedas;
  public usuario: User;
  public ganarMonedas;
  private _unsubscribeAll: Subject<any>;

  constructor(
      private _misComisionesService: MisComisionesService,
      private _coreMenuService: CoreMenuService,
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
  }

  obtenerListaMonedas() {
    this._misComisionesService.obtenerListaMonedas({
      page: this.page - 1, page_size: this.page_size, identificacion: this.usuario.persona.identificacion
    }).subscribe(info => {
      this.monedas = info.info;
      this.collectionSize = info.cont;
    });
  }

  iniciarPaginador() {
    this.paginator.pageChange.subscribe(() => {
      this.obtenerListaMonedas();
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
