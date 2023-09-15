import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';

import {CoreCommonModule} from '@core/common.module';
import {ContentHeaderModule} from 'app/layout/components/content-header/content-header.module';

import {AuthenticationModule} from './authentication/authentication.module';
import {MiscellaneousModule} from './miscellaneous/miscellaneous.module';
import {PagesViewsComponent} from './pages-views/pages-views.component';
import {RouterModule, Routes} from '@angular/router';
import {MensajeProductosComponent} from './mensaje-productos/mensaje-productos.component';
import {MensajeProductosFreeComponent} from './mensaje-productos-free/mensaje-productos-free.component';
import {PaginaEmpresaComponent} from './pagina-empresa/pagina-empresa.component';
import {SimuladorComponent} from './simulador/simulador.component';
import {TableSimuladorComponent} from './table-simulador/table-simulador.component';
import { PreApprovedCreditComponent } from './pre-approved-credit/pre-approved-credit.component';
import { CreditAprovedComponent } from './credit-aproved/credit-aproved.component';
import { PreApprovedCreditConsumerComponent } from './pre-approved-credit-consumer/pre-approved-credit-consumer.component';
import { ApprovedEndConsumerComponent } from './approved-end-consumer/approved-end-consumer.component';
import { SociosEmpleadosComponent } from './socios-empleados/socios-empleados.component';
import {SharedModule} from '../shared/shared.module';
import { ConfirmacionGaranteComponent } from './confirmacion-garante/confirmacion-garante.component';
import { ClienteComponent } from './cliente/cliente.component';
import {
    PreApprovedCreditConsumerAutomotiveComponent
} from './pre-approved-credit-consumer-automotive/pre-approved-credit-consumer-automotive.component';
import {ApprovedEndConsumerAutomitiveComponent} from './approved-end-consumer-automitive/approved-end-consumer-automitive.component';

// routing
const routes: Routes = [
    {
        path: 'piloto',
        loadChildren: () =>
            import('../pages/piloto/piloto.module').then((m) => m.PilotoModule),
    },
    {
        path: 'pages-news',
        component: PagesViewsComponent,
        data: {roles: 'BigPuntos'},
    },
    {
        path: 'mensajes-productos/:_id',
        component: MensajeProductosComponent,
        data: {animation: 'misc'},
    },
    {
        path: 'familia_big_puntos',
        component: MensajeProductosFreeComponent,
        data: {animation: 'misc'},
    },
    {
        path: 'premios/:empresa_id',
        component: PaginaEmpresaComponent,
        data: {animation: 'misc'},
    },
    {
        path: 'simulador',
        component: SimuladorComponent,
        data: {animation: 'misc'},
    },
    {
        path: 'tableSimulador',
        component: TableSimuladorComponent,
        data: {animation: 'misc'},
    },
    {
        path: 'preApprovedCredit',
        component: PreApprovedCreditComponent,
        data: {animation: 'misc'},
    },
    {
        path: 'preApprovedCreditConsumer',
        component: PreApprovedCreditConsumerComponent,
        data: {animation: 'misc'},
    },
    {
        path: 'preApprovedEndConsumer',
        component: ApprovedEndConsumerComponent,
        data: {animation: 'misc'},
    },
    {
        path: 'approvedCredit',
        component: CreditAprovedComponent,
        data: {animation: 'misc'},
    },
    {
        path: 'credito-consumo',
        loadChildren: () =>
            import('./simulador-consumo/similador-conusmo.module').then((m) => m.SimiladorConusmoModule)
    },
    {
        path: 'socios-empleados/:empresa',
        component: SociosEmpleadosComponent,
        data: {animation: 'misc'},
    },
    {
        path: 'clientes/:empresa',
        component: ClienteComponent,
        data: {animation: 'misc'},
    },

    {
        path: 'confirmacion-garante/:id',
        component: ConfirmacionGaranteComponent,
        data: {animation: 'misc'},
    },
    {
        path: 'credito-automotriz',
        loadChildren: () =>
            import('./simulador-automotriz/similador-automotriz.module').then((m) => m.SimiladorAutomotrizModule)
    },
    {
        path: 'preApprovedCreditConsumerAutomotive',
        component: PreApprovedCreditConsumerAutomotiveComponent,
        data: {animation: 'misc'},
    },
    {
        path: 'preApprovedEndConsumerAutomotive',
        component: ApprovedEndConsumerAutomitiveComponent,
        data: {animation: 'misc'},
    },
];

@NgModule({
    declarations: [
        PagesViewsComponent,
        MensajeProductosComponent,
        MensajeProductosFreeComponent,
        PaginaEmpresaComponent,
        SimuladorComponent,
        TableSimuladorComponent,
        PreApprovedCreditComponent,
        CreditAprovedComponent,
        PreApprovedCreditConsumerComponent,
        ApprovedEndConsumerComponent,
        SociosEmpleadosComponent,
        ConfirmacionGaranteComponent,
        ClienteComponent,
        PreApprovedCreditConsumerAutomotiveComponent,
        ApprovedEndConsumerAutomitiveComponent,
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        CoreCommonModule,
        ContentHeaderModule,
        NgbModule,
        NgSelectModule,
        FormsModule,
        AuthenticationModule,
        MiscellaneousModule,
        SharedModule,
    ],

    providers: [],
})
export class PagesModule {
}
