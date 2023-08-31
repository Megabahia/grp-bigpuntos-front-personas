import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CoreCommonModule} from '../../../../../@core/common.module';
import {ContentHeaderModule} from '../../../../layout/components/content-header/content-header.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule} from '@angular/forms';
import {AuthenticationModule} from '../../../pages/authentication/authentication.module';
import {MiscellaneousModule} from '../../../pages/miscellaneous/miscellaneous.module';
import {SharedModule} from '../../../shared/shared.module';


import {ExplicacionCreditoAutomotrizComponent} from './explicacion-credito-automotriz/explicacion-credito-automotriz.component';
import {CreditoAutomotrizRoutingModule} from './credito-automotriz-routing.module';
import {SolicitudCreditoAutomotrizComponent} from './solicitud-credito-automotriz/solicitud-credito-automotriz.component';
import {NgxMaskModule} from 'ngx-mask';
import {
    ResumenRequisitosCreditoAutomotrizComponent
} from './resumen-requisitos-credito-automotriz/resumen-requisitos-credito-automotriz.component';


@NgModule({
    declarations: [
        ExplicacionCreditoAutomotrizComponent,
        SolicitudCreditoAutomotrizComponent,
        ResumenRequisitosCreditoAutomotrizComponent,
    ],
    exports: [
        ExplicacionCreditoAutomotrizComponent,
        SolicitudCreditoAutomotrizComponent,
        ResumenRequisitosCreditoAutomotrizComponent
    ],
    imports: [
        CommonModule,
        CreditoAutomotrizRoutingModule,
        CoreCommonModule,
        ContentHeaderModule,
        NgbModule,
        NgSelectModule,
        FormsModule,
        AuthenticationModule,
        MiscellaneousModule,
        SharedModule,
        NgxMaskModule,
    ]
})
export class CreditoAutomotrizModule {
}
