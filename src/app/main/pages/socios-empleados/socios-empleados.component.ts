import {AfterViewInit, Component, OnChanges, OnInit} from '@angular/core';
import {CoreConfigService} from '../../../../@core/services/config.service';
import {PagesViewsService} from '../pages-views/pages-views.service';
import {SociosEmpleadosService} from './socios-empleados.service';
import {log} from 'util';
import {Router} from '@angular/router';

@Component({
    selector: 'app-socios-empleados',
    templateUrl: './socios-empleados.component.html',
    styleUrls: ['../pages-views/pages-views.component.scss'],
})
export class SociosEmpleadosComponent implements OnInit {
    public productos;
    public empresa;

    constructor(
        private _coreConfigService: CoreConfigService,
        private _pages_viewsService: PagesViewsService,
        private _sociosEmpleados: SociosEmpleadosService,
        private _router: Router,
    ) {
        console.log('after');
        const separador = window.location.href.split('/');
        this._sociosEmpleados.obtenerListaParametrosEmpresas(separador.pop()).subscribe(info => {
            this.empresa = info;
        }, error => {
            this._router.navigate(['/']);
        });

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
