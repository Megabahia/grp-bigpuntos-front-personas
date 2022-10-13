import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CoreConfigService} from '../../../../@core/services/config.service';
import {Router} from '@angular/router';
import {PreArpovedCreditService} from '../pre-approved-credit/pre-arpoved-credit.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import Decimal from 'decimal.js';

@Component({
  selector: 'app-pre-approved-credit-consumer',
  templateUrl: './pre-approved-credit-consumer.component.html',
  styleUrls: ['./pre-approved-credit-consumer.component.scss']
})
export class PreApprovedCreditConsumerComponent  implements OnInit {
  public envioForm: FormGroup;
  public submittedSimulador = false;
  public pathSent;
  @ViewChild('mensajeModal') mensajeModal;
  public mensaje = '';

  constructor(
      private _coreConfigService: CoreConfigService,
      private _formBuilder: FormBuilder,
      private _router: Router,
      private _preArpovedCreditService: PreArpovedCreditService,
      private modalService: NgbModal,
  ) {
    const ref = document.referrer;
    const host = document.location.host;
    // if (ref !== 'https://credicompra.com/') {
    //     if (host !== '209.145.61.41:4201') {
    //         this._router.navigate([
    //             `/grp/login`,
    //         ]);
    //         localStorage.clear();
    //         return;
    //     }
    // }

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

  cerrarModal() {
    this.modalService.dismissAll();
  }

  sentCode() {
    this.submittedSimulador = true;
    if (this.envioForm.invalid) {
      this.mensaje = 'Datos Incorrectos';
      this.abrirModal(this.mensajeModal);
      return;
    }
    const code = new Decimal(this.envioForm.value.code).toNumber();
    const document = new Decimal(this.envioForm.value.document).toNumber();
    //    ingresar if de validación antes de redireccionar
    localStorage.setItem('preApproved', 'true');
    const info = {
      code,
      document
    };
    this._preArpovedCreditService.validateCredit({'codigo': code, 'cedula': document})
        .subscribe((data: any) => {
          this._router.navigate([
            `/pages/approvedCredit`], {queryParams: data}
          );
        }, (error: any) => {
          this.mensaje = 'Usted No tiene un Crédito Pre-Aprobado pero puede acceder un a Crédito para realizar su compra';
          this.abrirModal(this.mensajeModal);
        });
    this.actionContinue();
  }

  abrirModal(modal) {
    this.modalService.open(modal);
  }

  ngOnInit(): void {
    this.envioForm = this._formBuilder.group({
      code:  [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.min(1),
        ],
      ],
    });
  }

  actionContinue() {
    this._router.navigate([
      `/pages/simulador`,
    ]);
    localStorage.setItem('preApproved', 'true');
  }
}
