import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SimiladorAutomotrizRoutingModule} from '../../../pages/simulador-automotriz/similador-automotriz-routing.module';
import {CoreCommonModule} from '../../../../../@core/common.module';
import {ContentHeaderModule} from '../../../../layout/components/content-header/content-header.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule} from '@angular/forms';
import {AuthenticationModule} from '../../../pages/authentication/authentication.module';
import {MiscellaneousModule} from '../../../pages/miscellaneous/miscellaneous.module';
import {SharedModule} from '../../../shared/shared.module';


import {ExplicacionCreditoAutomotrizComponent} from './explicacion-credito-automotriz/explicacion-credito-automotriz.component';


@NgModule({
    declarations: [
        ExplicacionCreditoAutomotrizComponent
    ],
    imports: [
        CommonModule,
        SimiladorAutomotrizRoutingModule,
        CoreCommonModule,
        ContentHeaderModule,
        NgbModule,
        NgSelectModule,
        FormsModule,
        AuthenticationModule,
        MiscellaneousModule,
        SharedModule,
    ]
})
export class CreditoAutomotrizModule {
}
