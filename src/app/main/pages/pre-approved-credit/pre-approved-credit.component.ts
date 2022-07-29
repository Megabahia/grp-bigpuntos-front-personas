import { Component, OnInit } from '@angular/core';
import { CoreConfigService } from '../../../../@core/services/config.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Decimal from 'decimal.js';

@Component({
    selector: 'app-pre-approved-credit',
    templateUrl: './pre-approved-credit.component.html',
    styleUrls: ['../simulador/simulador.component.scss']
})
export class PreApprovedCreditComponent implements OnInit {

    public envioForm: FormGroup;
    public submittedSimulador = false;

    constructor(
        private _coreConfigService: CoreConfigService,
        private _formBuilder: FormBuilder,
        private _router: Router,
    ) {
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

    get getsimuladorForm() {
        return this.envioForm.controls;
    }

    sentCode() {
        console.log('Llega', this.envioForm.invalid);
        this.submittedSimulador = true;
        if (this.envioForm.invalid) {
            return;
        }
        const code = new Decimal(this.envioForm.value.code).toNumber();
        const document = new Decimal(this.envioForm.value.document).toNumber();
        //    ingresar if de validación antes de redireccionar
        console.log('code', code, 'document', document);
        // this._router.navigate([
        //     `/pages/approvedCredit`,
        // ]);

    }

    ngOnInit(): void {
        this.envioForm = this._formBuilder.group({
            code: ['', [Validators.required]],
            document: ['', [Validators.required]],
        });
    }


    actionContinue() {
        this._router.navigate([
            `/pages/simulador`,
        ]);
    }

    actionEnviare() {
        this._router.navigate([
            `/pages/approvedCredit`,
        ]);
    }
}
