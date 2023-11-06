import {Component, OnInit} from '@angular/core';
import {CoreConfigService} from '../../../../@core/services/config.service';
import {PagesViewsService} from '../pages-views/pages-views.service';
import {SociosEmpleadosService} from '../socios-empleados/socios-empleados.service';
import {Router} from '@angular/router';

/**
 * Bigpuntos
 * Personas
 * Esta pantalla sirve para mostrar los productos a los clientes
 * Rutas:
 * `${environment.apiUrl}/central/productos/list-free-landing/`,
 * `${environment.apiUrl}/central/empresas/url/${url}`
 * `${environment.apiUrl}/central/empresas/urlClientes/${url}`
 */

@Component({
    selector: 'app-cliente',
    templateUrl: './cliente.component.html',
    styleUrls: ['./cliente.component.scss']
})
export class ClienteComponent implements OnInit {
    public productos;
    public empresa;
    public tipo = 'empleados';

    constructor(
        private _coreConfigService: CoreConfigService,
        private _pages_viewsService: PagesViewsService,
        private _sociosEmpleados: SociosEmpleadosService,
        private _router: Router,
    ) {
        console.log('after');
        const separador = window.location.href.split('/');
        this.tipo = separador[5] === 'clientes' ? 'clientes' : 'empleados';
        this._sociosEmpleados[this.tipo === 'clientes' ? 'obtenerListaParametrosEmpresasClientes' : 'obtenerListaParametrosEmpresas']
        (separador.pop()).subscribe(info => {
            this.empresa = info;
            this.listarProductos();
        }, error => {
            this._router.navigate(['/']);
        });


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
            .getlistaProductosfreeLanding({tipo: this.tipo, empresa_id: this.empresa._id})
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
