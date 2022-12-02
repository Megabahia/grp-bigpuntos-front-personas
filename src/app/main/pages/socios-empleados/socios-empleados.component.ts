import {Component, OnInit} from '@angular/core';
import {CoreConfigService} from '../../../../@core/services/config.service';
import {PagesViewsService} from '../pages-views/pages-views.service';

@Component({
    selector: 'app-socios-empleados',
    templateUrl: './socios-empleados.component.html',
    styleUrls: ['./socios-empleados.component.scss']
})
export class SociosEmpleadosComponent implements OnInit {
    public productos;

    constructor(
        private _coreConfigService: CoreConfigService,
        private _pages_viewsService: PagesViewsService

    ) {
        this.listarProductos();
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

    ngOnInit(): void {
        // this.paramService.obtenerListaPadresSinToken('VALORES_CALCULAR_CREDITO_CREDICOMPRA')
        //     .subscribe((info) => {
        //
        //     });
    }

    listarProductos() {
        this._pages_viewsService
            .getlistaProductosfree({tipo: 'producto-nuestra-familia-sm'})
            .subscribe(
                (data) => {
                    this.productos = data.info;
                },
                (error) => {
                    /*      this.mensaje = "Error al cargar productos";
                    this.abrirModal(this.mensajeModal); */
                }
            );
    }

}
