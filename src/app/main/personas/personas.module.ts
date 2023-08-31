import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CompletarPerfilComponent} from './vistas/completar-perfil/completar-perfil.component';
import {FelicidadesRegistroComponent} from './vistas/felicidades-registro/felicidades-registro.component';
import {PrincipalComponent} from './vistas/principal/principal.component';
import {QueEsComponent} from './vistas/que-es/que-es.component';
import {MisMonedasComponent} from './vistas/supermonedas/mis-monedas/mis-monedas.component';
import {MisFacturasComponent} from './vistas/supermonedas/mis-facturas/mis-facturas.component';
import {MisCalificacionesComponent} from './vistas/supermonedas/mis-calificaciones/mis-calificaciones.component';
import {CompartirPublicacionesComponent} from './vistas/supermonedas/compartir-publicaciones/compartir-publicaciones.component';
import {MonedasOtorgadasComponent} from './vistas/supermonedas/monedas-otorgadas/monedas-otorgadas.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {CoreCommonModule} from '@core/common.module';
import {RouterModule} from '@angular/router';
import {ContentHeaderModule} from 'app/layout/components/content-header/content-header.module';
import {TranslateModule} from '@ngx-translate/core';
import {SwiperModule} from 'ngx-swiper-wrapper';
import {FormsModule} from '@angular/forms';
import {CoreTouchspinModule} from '@core/components/core-touchspin/core-touchspin.module';
import {CoreSidebarModule} from '@core/components';
import {AuthGuard} from '../../auth/helpers/auth.guards';
import {Role} from '../../auth/models/role';
import {BienvenidoComponent} from './vistas/bienvenido/bienvenido.component';
import {Ng2FlatpickrModule} from 'ng2-flatpickr';
import {CardSnippetModule} from '../../../@core/components/card-snippet/card-snippet.module';
import {PerfilUsuarioComponent} from '../center/perfil-usuario/perfil-usuario.component';
import {ShareButtonsModule} from 'ngx-sharebuttons/buttons';
import {ShareIconsModule} from 'ngx-sharebuttons/icons';
import {PagarConSuperMonedasComponent} from './vistas/supermonedas/pagar-con-supermonedas/pagar-con-supermonedas.component';
import {NgxBarcodeModule} from 'ngx-barcode';
import {QRCodeModule} from 'angularx-qrcode';
import {NgxPrintModule} from 'ngx-print';
import {CreditosAutonomosComponent} from './vistas/creditos-autonomos/creditos-autonomos.component';
import {VideoExplicativoAutComponent} from './vistas/creditos-autonomos/video-explicativo/video-explicativo.component';
import {PerfilPersonaAutComponent} from './vistas/creditos-autonomos/perfil-persona/perfil-persona.component';
import {
    EstablecimientosComercialesAutComponent
} from './vistas/creditos-autonomos/establecimientos-comerciales/establecimientos-comerciales.component';
import {
    EstablecimientoSeleccionadoAutComponent
} from './vistas/creditos-autonomos/establecimiento-seleccionado/establecimiento-seleccionado.component';
import {RucPersonaAutComponent} from './vistas/creditos-autonomos/ruc-persona/ruc-persona.component';
import {ResultadosCreditoAutComponent} from './vistas/creditos-autonomos/resultados-credito/resultados-credito.component';
import {MensajeResultadoAutComponent} from './vistas/creditos-autonomos/mensaje-resultado/mensaje-resultado.component';
import {
    ListadoCreditosPreAprobadosComponent
} from './vistas/creditos-pre-aprobados/litado-creditos-pre-aprobados/listado-creditos-pre-aprobados.component';
import {CreditosPreAprobadosEmpComponent} from './vistas/creditos-empleados/creditos-pre-aprobados/creditos-pre-aprobados-emp.component';
import {ListadoComponent as listadoEstadoCreditos} from './vistas/mis-creditos/vistas/estado-creditos/listado/listado.component';
import {ListadoComponent as listadoPagoCuotas} from './vistas/mis-creditos/vistas/registrar-pagos-cuotas/listado/listado.component';
import {MisPremiosComponent} from './vistas/mis-premios/mis-premios.component';
import {ComoFuncionaComponent} from './vistas/como-funciona/como-funciona.component';
import {DondeCanjearComponent} from './vistas/donde-canjear/donde-canjear.component';
import {ReclamosRequerimientosComponent} from './vistas/reclamos-requerimientos/reclamos-requerimientos.component';

import {NgxMaskModule, IConfig} from 'ngx-mask';
import {SolicitudCreditoComponent} from './vistas/creditos-autonomos/solicitud-credito/solicitud-credito.component';
import {
    ResumenRequisitosCreditoComponent
} from './vistas/creditos-autonomos/resumen-requisitos-credito/resumen-requisitos-credito.component';
import {ValidacionDatosComponent} from './vistas/creditos-autonomos/validacion-datos/validacion-datos.component';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {QueEsCredicompraComponent} from './vistas/que-es-credicompra/que-es-credicompra.component';
import {ComoFuncionaCredicompraComponent} from './vistas/como-funciona-credicompra/como-funciona-credicompra.component';
import {ComoAccederACredicompraComponent} from './vistas/como-acceder-a-credicompra/como-acceder-a-credicompra.component';
import {SharedModule} from '../shared/shared.module';
import {TerminosComponent} from './vistas/terminos/terminos.component';
import {ProcesandoCreditoComponent} from './procesando-credito/procesando-credito.component';
import { CreditoAutomotrizComponent } from './vistas/credito-automotriz/credito-automotriz.component';
import {
    ExplicacionCreditoAutomotrizComponent
} from './vistas/credito-automotriz/explicacion-credito-automotriz/explicacion-credito-automotriz.component';
import {
    SolicitudCreditoAutomotrizComponent
} from './vistas/credito-automotriz/solicitud-credito-automotriz/solicitud-credito-automotriz.component';
import {
    ResumenRequisitosCreditoAutomotrizComponent
} from './vistas/credito-automotriz/resumen-requisitos-credito-automotriz/resumen-requisitos-credito-automotriz.component';

const maskConfig: Partial<IConfig> = {
    validation: false,
};

const routes = [
    {path: '', redirectTo: 'inicio', pathMatch: 'full'},
    {
        path: 'inicio',
        component: PrincipalComponent,
        data: {roles: [Role.BigPuntos]},
        canActivate: [AuthGuard]
        // data: { animation: 'auth' }
    },
    {
        path: 'que-es',
        component: QueEsComponent,
        data: {roles: [Role.BigPuntos]},
        canActivate: [AuthGuard]
        // data: { animation: 'auth' }
    },
    {
        path: 'como-funciona',
        component: ComoFuncionaComponent,
        data: {roles: [Role.BigPuntos]},
        canActivate: [AuthGuard]
        // data: { animation: 'auth' }
    },
    {
        path: 'donde-canjear',
        component: DondeCanjearComponent,
        data: {roles: [Role.BigPuntos]},
        canActivate: [AuthGuard]
        // data: { animation: 'auth' }
    },
    {
        path: 'que-es-credicompra',
        component: QueEsCredicompraComponent,
        data: {roles: [Role.BigPuntos]},
        canActivate: [AuthGuard]
        // data: { animation: 'auth' }
    },
    {
        path: 'como-funciona-credicompra',
        component: ComoFuncionaCredicompraComponent,
        data: {roles: [Role.BigPuntos]},
        canActivate: [AuthGuard]
        // data: { animation: 'auth' }
    },
    {
        path: 'como-acceder-credicompra',
        component: ComoAccederACredicompraComponent,
        data: {roles: [Role.BigPuntos]},
        canActivate: [AuthGuard]
        // data: { animation: 'auth' }
    },
    {
        path: 'BigPuntos',
        children: [
            {path: '', redirectTo: 'mis-monedas', pathMatch: 'full'},
            {
                path: 'mis-bigpuntos',
                component: MisMonedasComponent,
                data: {roles: [Role.BigPuntos]},
                canActivate: [AuthGuard]
                // data: { animation: 'auth' }
            },
            {
                path: 'mis-facturas',
                component: MisFacturasComponent,
                data: {roles: [Role.BigPuntos]},
                canActivate: [AuthGuard]
                // data: { animation: 'auth' }
            },
            {
                path: 'mis-calificaciones',
                component: MisCalificacionesComponent,
                data: {roles: [Role.BigPuntos]},
                canActivate: [AuthGuard]
                // data: { animation: 'auth' }
            },
            {
                path: 'mis-calificaciones',
                component: MisCalificacionesComponent,
                data: {roles: [Role.BigPuntos]},
                canActivate: [AuthGuard]
                // data: { animation: 'auth' }
            },
            {
                path: 'compartir-publicaciones-facebook',
                component: CompartirPublicacionesComponent,
                data: {roles: [Role.BigPuntos], pantalla: 'facebook'},
                canActivate: [AuthGuard]
                // data: { animation: 'auth' }
            },
            {
                path: 'compartir-publicaciones-whatsapp',
                component: CompartirPublicacionesComponent,
                data: {roles: [Role.BigPuntos], pantalla: 'whatsapp'},
                canActivate: [AuthGuard]
                // data: { animation: 'auth' }
            },
            {
                path: 'Big_Puntos_otorgados_por_compras_en_establecimientos_afiliados',
                component: MonedasOtorgadasComponent,
                data: {roles: [Role.BigPuntos]},
                canActivate: [AuthGuard]
                // data: { animation: 'auth' }
            },
            {
                path: 'pagar-con-big-puntos',
                component: PagarConSuperMonedasComponent,
                data: {roles: [Role.BigPuntos]},
                canActivate: [AuthGuard]
                // data: { animation: 'auth' }
            },
        ],

    },
    {
        path: 'creditos-autonomos',
        children: [
            {path: '', redirectTo: 'solicitar-credito', pathMatch: 'full'},
            {
                path: 'solicitar-credito',
                component: CreditosAutonomosComponent,
                data: {roles: [Role.BigPuntos]},
                canActivate: [AuthGuard]
                // data: { animation: 'auth' }
            },
            {
                path: 'validacion-datos',
                component: ValidacionDatosComponent,
                data: {roles: [Role.BigPuntos]},
                canActivate: [AuthGuard]
                // data: { animation: 'auth' }
            },
        ]
    },
    {
        path: 'creditos-empleados',
        children: [
            {path: '', redirectTo: 'creditos-pre-aprobados', pathMatch: 'full'},
            {
                path: 'creditos-pre-aprobados',
                component: CreditosPreAprobadosEmpComponent,
                data: {roles: [Role.BigPuntos]},
                canActivate: [AuthGuard]
                // data: { animation: 'auth' }
            },
        ]
    },
    {
        path: 'creditos-pre-aprobados',
        children: [
            {path: '', redirectTo: 'listado', pathMatch: 'full'},
            {
                path: 'listado',
                component: ListadoCreditosPreAprobadosComponent,
                data: {roles: [Role.BigPuntos]},
                canActivate: [AuthGuard]
                // data: { animation: 'auth' }
            },
        ]
    },
    {
        path: 'mis-creditos',
        children: [
            {path: '', redirectTo: 'estado-creditos', pathMatch: 'full'},
            {
                path: 'estado-creditos',
                component: listadoEstadoCreditos,
                data: {roles: [Role.BigPuntos]},
                canActivate: [AuthGuard]
                // data: { animation: 'auth' }
            },
            {
                path: 'registrar-pagos-cuotas',
                component: listadoPagoCuotas,
                data: {roles: [Role.BigPuntos]},
                canActivate: [AuthGuard]
                // data: { animation: 'auth' }
            },
        ]
    },
    {
        path: 'bienvenido',
        component: BienvenidoComponent,
        data: {activacion: [1]},
        canActivate: [AuthGuard]

        // data: { animation: 'auth' }
    },
    {
        path: 'procesandoCredito',
        component: ProcesandoCreditoComponent,
        data: {noPuedeSolicitar: true},
        canActivate: [AuthGuard]

        // data: { animation: 'auth' }
    },
    {
        path: 'completarPerfil',
        component: CompletarPerfilComponent,
        data: {activacion: [2, 3], animation: 'flatpickr'},
        canActivate: [AuthGuard]

        // data: { animation: 'auth' }
    },
    {
        path: 'felicidadesRegistro',
        component: FelicidadesRegistroComponent,
        data: {activacion: [4]},
        canActivate: [AuthGuard]

        // data: { animation: 'auth' }
    },
    {
        path: 'reclamos-y-requerimientos',
        component: ReclamosRequerimientosComponent,
        // data: {activacion: [4]},
        canActivate: [AuthGuard]
        // data: { animation: 'auth' }
    },
    {
        path: 'mis-premios',
        component: MisPremiosComponent,
        // data: {activacion: [4]},
        canActivate: [AuthGuard]
        // data: { animation: 'auth' }
    },
    {
        path: 'terminos',
        component: TerminosComponent,
        // data: {activacion: [4]},
        canActivate: [AuthGuard]
        // data: { animation: 'auth' }
    },
    {
        path: 'creditos-automotriz/solicitar-credito',
        component: CreditoAutomotrizComponent,
        // data: {activacion: [4]},
        canActivate: [AuthGuard]
        // data: { animation: 'auth' }
    },
    {
        path: '**',
        redirectTo: '/pages/miscellaneous/error', // Error 404 - Page not found
    },
];

@NgModule({
    declarations: [
        BienvenidoComponent,
        CompletarPerfilComponent,
        FelicidadesRegistroComponent,
        PrincipalComponent,
        QueEsComponent,
        MisMonedasComponent,
        MisFacturasComponent,
        MisCalificacionesComponent,
        CompartirPublicacionesComponent,
        MonedasOtorgadasComponent,
        PerfilUsuarioComponent,
        PagarConSuperMonedasComponent,
        CreditosAutonomosComponent,
        VideoExplicativoAutComponent,
        PerfilPersonaAutComponent,
        EstablecimientosComercialesAutComponent,
        EstablecimientoSeleccionadoAutComponent,
        RucPersonaAutComponent,
        ResultadosCreditoAutComponent,
        MensajeResultadoAutComponent,
        ListadoCreditosPreAprobadosComponent,
        CreditosPreAprobadosEmpComponent,
        listadoEstadoCreditos,
        listadoPagoCuotas,
        MisPremiosComponent,
        ComoFuncionaComponent,
        DondeCanjearComponent,
        ReclamosRequerimientosComponent,
        SolicitudCreditoComponent,
        ResumenRequisitosCreditoComponent,
        ValidacionDatosComponent,
        QueEsCredicompraComponent,
        ComoFuncionaCredicompraComponent,
        ComoAccederACredicompraComponent,
        TerminosComponent,
        ProcesandoCreditoComponent,
        CreditoAutomotrizComponent,
        ExplicacionCreditoAutomotrizComponent,
        SolicitudCreditoAutomotrizComponent,
        ResumenRequisitosCreditoAutomotrizComponent,
    ],
    imports: [
        CoreCommonModule,
        RouterModule.forChild(routes),
        ContentHeaderModule,
        TranslateModule,
        SwiperModule,
        FormsModule,
        CoreTouchspinModule,
        CoreSidebarModule,
        NgbModule,
        Ng2FlatpickrModule,
        CardSnippetModule,
        ShareIconsModule,
        ShareButtonsModule,
        NgxBarcodeModule,
        QRCodeModule,
        NgxPrintModule,
        // Mask
        NgxMaskModule.forRoot(maskConfig),
        // NGX-datatable
        NgxDatatableModule,
        SharedModule,
    ],
    exports: [
        BienvenidoComponent,
        CompletarPerfilComponent,
        FelicidadesRegistroComponent,
        PrincipalComponent,
        QueEsComponent,
        MisMonedasComponent,
        MisFacturasComponent,
        MisCalificacionesComponent,
        CompartirPublicacionesComponent,
        MonedasOtorgadasComponent,
        PagarConSuperMonedasComponent,
        CreditosAutonomosComponent,
        VideoExplicativoAutComponent,
        PerfilPersonaAutComponent,
        EstablecimientosComercialesAutComponent,
        EstablecimientoSeleccionadoAutComponent,
        RucPersonaAutComponent,
        ResultadosCreditoAutComponent,
        MensajeResultadoAutComponent,
        ListadoCreditosPreAprobadosComponent,
        CreditosPreAprobadosEmpComponent,
        listadoEstadoCreditos,
        listadoPagoCuotas,
        ExplicacionCreditoAutomotrizComponent,
        SolicitudCreditoAutomotrizComponent,
        ResumenRequisitosCreditoAutomotrizComponent,
    ],
})
export class PersonasModule {
}
