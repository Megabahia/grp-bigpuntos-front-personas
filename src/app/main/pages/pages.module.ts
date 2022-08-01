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

// routing
const routes: Routes = [
    {
        path: 'pages-views',
        component: PagesViewsComponent,
        data: {roles: 'BigPuntos'},
    },
    {
        path: 'mensajes-productos/:_id',
        component: MensajeProductosComponent,
        data: {animation: 'misc'},
    },
    {
        path: 'mensajes-productos-free',
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
        path: 'approvedCredit',
        component: CreditAprovedComponent,
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
    ],

    providers: [],
})
export class PagesModule {
}
