import { Component, OnInit } from '@angular/core';
import { CoreConfigService } from '../../../../@core/services/config.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-credit-aproved',
  templateUrl: './credit-aproved.component.html',
  styleUrls: ['../simulador/simulador.component.scss']
})
export class CreditAprovedComponent implements OnInit {

  constructor(      private _coreConfigService: CoreConfigService,
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

  ngOnInit(): void {
  }
  actionContinue() {
    this._router.navigate([
      `/grp/login`,
    ]);
  }

}
