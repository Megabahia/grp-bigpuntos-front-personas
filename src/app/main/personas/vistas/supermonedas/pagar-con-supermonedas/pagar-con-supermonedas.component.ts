import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CoreMenuService } from '@core/components/core-menu/core-menu.service';
import { NgbPagination, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'app/auth/models';
import { Subject } from 'rxjs';
import { PagarConSuperMonedasService } from './pagar-con-supermonedas.service';
import { CoreSidebarService } from '../../../../../../@core/components/core-sidebar/core-sidebar.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PagoMonto } from '../../../models/supermonedas';
import moment from 'moment';

@Component({
  selector: 'app-pagar-con-supermonedas',
  templateUrl: './pagar-con-supermonedas.component.html',
  styleUrls: ['./pagar-con-supermonedas.component.scss'],
  providers: [DatePipe]

})
export class PagarConSuperMonedasComponent implements OnInit {
  @ViewChild(NgbPagination) paginator: NgbPagination;
  @ViewChild('comprobanteCompraSuperMonedasMdl') comprobanteCompraSuperMonedasMdl;
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
  public monto;
  public nombreComercial;
  public listaEmpresas;
  public pagoMonto: PagoMonto;
  public mensaje = "";
  constructor(
    private _pagarConSuperMonedasService: PagarConSuperMonedasService,
    private _coreMenuService: CoreMenuService,
    private _coreSidebarService: CoreSidebarService,
    private datePipe: DatePipe,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal,

  ) {
    this._unsubscribeAll = new Subject();
    this.usuario = this._coreMenuService.grpPersonasUser;
    this.pagoMonto = this.incializarPagoMonto();
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
  incializarPagoMonto() {
    return {
      id: "",
      codigoCobro: "",
      monto: "",
      user_id: this.usuario.id,
      empresa_id: ""
    };
  }
  ngAfterViewInit() {
    this.iniciarPaginador();
    this.obtenerListaEmpresa();
  }
  buscarEmpresa() {

  }
  toggleSidebar(name, id): void {
    this.pagoMonto.empresa_id = id;
    let empresa = this.listaEmpresas.filter(x => x._id == id);
    if (empresa.length) {
      this.nombreTienda = empresa[0].nombreComercial;
    }
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }
  enviarMonto() {
    this.cobrarSuperMonedasSubmitted = true;

    // stop here if form is invalid
    if (this.compraSuperMonedasForm.invalid) {
      return;
    }
    this.pagoMonto.codigoCobro = this.pagoMonto.user_id + "-" + moment().valueOf().toString();

    this.cargandoCompraSupermonedas = true;
    this._pagarConSuperMonedasService.pagarConSuperMonedas(this.pagoMonto).subscribe((info) => {
      this.cargandoCompraSupermonedas = false;
    },(error)=>{
      this.mensaje = "Ha ocurrido un error en el pago"
      this.abrirModal(this.mensajeModal);
    });
    this.abrirModalLg(this.comprobanteCompraSuperMonedasMdl);
  }
  obtenerListaEmpresa() {
    this._pagarConSuperMonedasService.obtenerListaEmpresa({
      page: this.page - 1, page_size: this.page_size, nombreComercial: this.nombreComercial
    }).subscribe(info => {
      this.listaEmpresas = info.info;
      this.collectionSize = info.cont;
    });
  }
  iniciarPaginador() {
    this.paginator.pageChange.subscribe(() => {
      this.obtenerListaEmpresa();
    });
  }

  transformarFecha(fecha) {
    let nuevaFecha = this.datePipe.transform(fecha, 'yyyy-MM-dd');
    return nuevaFecha;
  }
  abrirModalLg(modal) {
    this._modalService.open(modal, {
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
