import {Component, OnInit} from '@angular/core';
import {CoreSidebarService} from '../../../../../@core/components/core-sidebar/core-sidebar.service';

@Component({
    selector: 'app-reclamos-requerimientos',
    templateUrl: './reclamos-requerimientos.component.html',
    styleUrls: ['./reclamos-requerimientos.component.scss']
})
export class ReclamosRequerimientosComponent implements OnInit {

    constructor(
        private _coreSidebarService: CoreSidebarService,
    ) {
    }

    ngOnInit(): void {
    }

}
