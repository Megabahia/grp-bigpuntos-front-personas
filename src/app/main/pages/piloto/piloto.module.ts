import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
import {CoreCommonModule} from '../../../../@core/common.module';
import {ContentHeaderModule} from '../../../layout/components/content-header/content-header.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule} from '@angular/forms';
import {AuthenticationModule} from '../authentication/authentication.module';
import {MiscellaneousModule} from '../miscellaneous/miscellaneous.module';
import {CreditRequirementsComponent} from './credit-requirements/credit-requirements.component';
import {CreditRequestComponent} from './credit-request/credit-request.component';
import {SimulatorCrediCompraComponent} from './simulator-credi-compra/simulator-credi-compra.component';

const routes = [
    {
        path: 'solicitud-credito',
        component: CreditRequestComponent,
        data: {animation: 'misc'},
    },
    {
        path: 'simulador-de-credito',
        component: SimulatorCrediCompraComponent,
        data: {animation: 'misc'},
    },
    {
        path: 'requisitos-de-credito',
        component: CreditRequirementsComponent,
        data: {animation: 'misc'},
    }];

@NgModule({
    declarations: [CreditRequestComponent, SimulatorCrediCompraComponent, CreditRequirementsComponent],
    imports: [
        SharedModule,
        CommonModule,
        RouterModule.forChild(routes),
        CoreCommonModule,
        ContentHeaderModule,
        NgbModule,
        NgSelectModule,
        FormsModule,
        AuthenticationModule,
        MiscellaneousModule,
    ]
})
export class PilotoModule {
}
