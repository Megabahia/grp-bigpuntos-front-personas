import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CoreMenuService } from '@core/components/core-menu/core-menu.service';
import { NgbPagination, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'app/auth/models';
import { Subject } from 'rxjs';
import { PagarConSuperMonedasService } from './pagar-con-supermonedas.service';
import { CoreSidebarService } from '../../../../../../@core/components/core-sidebar/core-sidebar.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-pagar-con-supermonedas',
  templateUrl: './pagar-con-supermonedas.component.html',
  styleUrls: ['./pagar-con-supermonedas.component.scss'],
  providers: [DatePipe]

})
export class PagarConSuperMonedasComponent implements OnInit {
  @ViewChild(NgbPagination) paginator: NgbPagination;
  @ViewChild('comprobanteCompraSuperMonedasMdl') comprobanteCompraSuperMonedasMdl;
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
  public monto;
  public nombreComercial;
  constructor(
    private _monedasOtorgadasService: PagarConSuperMonedasService,
    private _coreMenuService: CoreMenuService,
    private _coreSidebarService: CoreSidebarService,
    private datePipe: DatePipe,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal,

  ) {
    this._unsubscribeAll = new Subject();
    this.usuario = this._coreMenuService.currentUser;

  }
  get cobSupForm() {
    return this.compraSuperMonedasForm.controls;
  }
  ngOnInit(): void {
    this.compraSuperMonedasForm = this._formBuilder.group({
      monto: ['', [Validators.required]],
    }
    );
  }
  ngAfterViewInit() {
    this.iniciarPaginador();
    this.obtenerListaMonedas();
  }
  buscarEmpresa() {

  }
  toggleSidebar(name, id): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }
  enviarMonto() {
    this.abrirModalLg(this.comprobanteCompraSuperMonedasMdl);
  }
  obtenerListaMonedas() {
    this._monedasOtorgadasService.obtenerListaMonedas({
      page: this.page - 1, page_size: this.page_size, user_id: this.usuario.id
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

  transformarFecha(fecha) {
    let nuevaFecha = this.datePipe.transform(fecha, 'yyyy-MM-dd');
    return nuevaFecha;
  }
  abrirModalLg(modal) {
    this._modalService.open(modal,{
      size: "lg"
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

}
