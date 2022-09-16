import { Component, OnInit } from '@angular/core';
import {CoreConfigService} from '../../../../@core/services/config.service';

@Component({
  selector: 'app-credit-request',
  templateUrl: './credit-request.component.html',
  styleUrls: ['./credit-request.component.scss']
})
export class CreditRequestComponent implements OnInit {

  constructor(
      private _coreConfigService: CoreConfigService,
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

}
