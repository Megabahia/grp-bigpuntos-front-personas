import { Component, OnInit } from "@angular/core";

import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

import { CoreConfigService } from "@core/services/config.service";
import { PagesViewsService } from "../pages-views/pages-views.service";

@Component({
  selector: "app-mensaje-productos",
  templateUrl: "./mensaje-productos.component.html",
  styleUrls: ["../pages-views/pages-views.component.scss"],
})
export class MensajeProductosComponent implements OnInit {
  public coreConfig: any;
  public productos;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   */
  constructor(
    private _coreConfigService: CoreConfigService,
    private _pages_viewsService: PagesViewsService
  ) {
    this.listarProductos();

    this._unsubscribeAll = new Subject();

    // Configure the layout
    this._coreConfigService.config = {
      layout: {
        navbar: {
          hidden: true,
        },
        footer: {
          hidden: true,
        },
        menu: {
          hidden: true,
        },
        customizer: false,
        enableLocalStorage: false,
      },
    };
  }
  listarProductos() {
    this._pages_viewsService
      .getlistaProductos({ tipo: "producto-mensaje-sm" })
      .subscribe(
        (data) => {
          this.productos = data.info;
          console.log("Los productos ", this.productos);
        },
        (error) => {
          console.log("No tiene productos");

          /*      this.mensaje = "Error al cargar productos";
          this.abrirModal(this.mensajeModal); */
        }
      );
  }
  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to config changes
    this._coreConfigService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.coreConfig = config;
      });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
