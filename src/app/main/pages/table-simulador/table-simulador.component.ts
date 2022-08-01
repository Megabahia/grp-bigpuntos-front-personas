import { Component, OnInit, Input } from '@angular/core';
import { CoreConfigService } from '../../../../@core/services/config.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector: 'app-table-simulador',
    templateUrl: './table-simulador.component.html',
    styleUrls: ['../simulador/simulador.component.scss']
})
export class TableSimuladorComponent implements OnInit {
    @Input() info: any;
    @Input() banner2: any;
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _coreConfigService: CoreConfigService,
        private _formBuilder: FormBuilder,
        private _router: Router,
    ) {
        localStorage.getItem('simulador');
        if (localStorage.getItem('simulador') !== 'ok') {
            this.actionContinue();
        }

        this._unsubscribeAll = new Subject();
        // Configure the layout
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
    }
    actionContinue() {
        this._router.navigate([
            `/grp/login`,
        ]);
    }
}
