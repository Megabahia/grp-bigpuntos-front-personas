import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { MisFacturasService } from '../mis-facturas/mis-facturas.service';
import { CoreMenuService } from '../../../../../../@core/components/core-menu/core-menu.service';

@Component({
  selector: 'app-mis-calificaciones',
  templateUrl: './mis-calificaciones.component.html',
  styleUrls: ['./mis-calificaciones.component.scss'],
  providers: [DatePipe]
})
export class MisCalificacionesComponent implements OnInit {
  @ViewChild(NgbPagination) paginator: NgbPagination;
  public page = 1;
  public page_size: any = 10;
  public maxSize;
  public collectionSize;
  public facturas;
  public usuario;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _misFacturasService: MisFacturasService,
    private datePipe: DatePipe,
    private _coreSidebarService: CoreSidebarService,
    private _coreMenuService: CoreMenuService,

  ) {
    this._unsubscribeAll = new Subject();

  }

  ngOnInit(): void {
    this.usuario = this._coreMenuService.grpPersonasUser;

  }
  ngAfterViewInit() {
    this.iniciarPaginador();

    this.obtenerListaFacturas();
  }

  toggleSidebar(name, id): void {
    console.log(id);
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  obtenerListaFacturas() {
    this._misFacturasService.obtenerFacturas({
      page: this.page - 1, page_size: this.page_size, user_id: this.usuario.id
    }).subscribe(info => {
      this.facturas = info.info;
      this.collectionSize = info.cont;
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
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }


}
