import { Component, OnInit } from '@angular/core';
import {CoreConfigService} from '../../../../../../@core/services/config.service';

@Component({
  selector: 'app-validacion-datos',
  templateUrl: './validacion-datos.component.html',
  styleUrls: ['./validacion-datos.component.scss']
})
export class ValidacionDatosComponent implements OnInit {

  constructor(
      private _coreConfigService: CoreConfigService,
  ) { }

  ngOnInit(): void {
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



}
