import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { NgbPagination, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { MisFacturasService } from './mis-facturas.service';
import { CoreMenuService } from '../../../../../../@core/components/core-menu/core-menu.service';
import { ParametrizacionesService } from '../../../servicios/parametrizaciones.service';
import { GanarSuperMoneda } from '../../../models/supermonedas';
import { BienvenidoService } from '../../bienvenido/bienvenido.service';

@Component({
  selector: 'app-mis-facturas',
  templateUrl: './mis-facturas.component.html',
  styleUrls: ['./mis-facturas.component.scss'],
  providers: [DatePipe]
})
export class MisFacturasComponent implements OnInit {
  @ViewChild(NgbPagination) paginator: NgbPagination;
  @ViewChild('mensajeModal') mensajeModal;

  public page = 1;
  public page_size: any = 10;
  public maxSize;
  public collectionSize;
  public usuario;
  public empresaId;
  public loading = false;
  public mensaje = "";
  public ganarMonedasFacElec;
  public ganarMonedasFacFisi;
  public superMonedasElec: GanarSuperMoneda;
  public superMonedasFisi: GanarSuperMoneda;
  public nombreFacElec = "";
  public nombreFacFisi = "";
  public archivoFacElec = new FormData();
  public archivoFacFisi = new FormData();
  public facturas;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _misFacturasService: MisFacturasService,
    private datePipe: DatePipe,
    private _coreSidebarService: CoreSidebarService,
    private _coreMenuService: CoreMenuService,
    private paramService: ParametrizacionesService,
    private _bienvenidoService: BienvenidoService,
    private modalService: NgbModal,


  ) {
    this.usuario = this._coreMenuService.grpPersonasUser;

    this.superMonedasElec = this.inicializarSuperMoneda();
    this.superMonedasFisi = this.inicializarSuperMoneda();

    this._unsubscribeAll = new Subject();

  }
  inicializarSuperMoneda(): GanarSuperMoneda {
    return {
      credito: 0,
      descripcion: "",
      tipo: "Credito",
      user_id: this.usuario.id,
      empresa_id: this.empresaId
    }
  }
  ngOnInit(): void {
    this.obtenerEmpresaId();

    this.usuario = this._coreMenuService.grpPersonasUser;
    this.paramService.obtenerParametroNombreTipo("monedas_facturas_elec", "GANAR_SUPERMONEDAS").subscribe((info) => {
      this.ganarMonedasFacElec = info;
      this.superMonedasElec.credito = this.ganarMonedasFacElec.valor;
      this.superMonedasElec.descripcion = "Gana " + this.ganarMonedasFacElec.valor + " supermonedas por subir factura electrónica";
    });
    this.paramService.obtenerParametroNombreTipo("monedas_facturas_fisi", "GANAR_SUPERMONEDAS").subscribe((info) => {
      this.ganarMonedasFacFisi = info;
      this.superMonedasFisi.credito = this.ganarMonedasFacFisi.valor;
      this.superMonedasFisi.descripcion = "Gana " + this.ganarMonedasFacFisi.valor + " supermonedas por subir factura física";
    });
  }
  obtenerEmpresaId() {
    this._bienvenidoService.obtenerEmpresa({
      nombreComercial: "Global Red Pyme"
    }).subscribe((info) => {
      this.superMonedasElec.empresa_id = info._id;
      this.superMonedasFisi.empresa_id = info._id;
    }, (error) => {
      this.mensaje = "Ha ocurrido un error al actualizar su imagen";
      this.abrirModal(this.mensajeModal);
    });
  }
  ngAfterViewInit() {
    this.iniciarPaginador();

    this.obtenerListaFacturas();
  }

  toggleSidebar(name): void {
    if (name == "factura-electronica") {
      this.nombreFacElec = "";
      this.archivoFacElec = new FormData();
    }
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }
  subirFacturaElectronica() {
    this._bienvenidoService.guardarSuperMonedas(this.superMonedasElec).subscribe((infoSM) => {
    });
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
  cargarFacturaElec(event: any) {
    if (event.target.files && event.target.files[0]) {
      let archivo = event.target.files[0];
      this.nombreFacElec = archivo.name;

      this.archivoFacElec = new FormData();
      this.archivoFacElec.append('urlArchivo', archivo, Date.now() + "_" + archivo.name);

    }
  }
  visualizarNombreArchivo(nombre) {
    return nombre.replace('https://globalredpymes.s3.amazonaws.com/CENTRAL/archivosFacturas/', '');
  }
  subirFacturaElec() {
    if (this.nombreFacElec) {
      this.loading = true;
      this.archivoFacElec.append('user_id', this.usuario.id);
      this._misFacturasService.subirFactura(this.archivoFacElec).subscribe((info) => {
        this.obtenerListaFacturas();
        this.toggleSidebar("factura-electronica");

        this._bienvenidoService.guardarSuperMonedas(this.superMonedasElec).subscribe((infoSM) => {
          this.loading = false;

          this.mensaje = "Factura cargada con éxito, ud ha ganado " + this.ganarMonedasFacElec.valor + " super monedas";
          this.abrirModal(this.mensajeModal);
        });

      },
        (error) => {
          this.mensaje = "Ha ocurrido un error al cargar su factura";
          this.abrirModal(this.mensajeModal);
        });
    } else {
      this.mensaje = "Es necesario cargar un archivo tipo PDF o XML";
      this.abrirModal(this.mensajeModal);
    }
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
