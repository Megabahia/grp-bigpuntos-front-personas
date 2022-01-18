import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CoreMenuService } from '@core/components/core-menu/core-menu.service';
import { CoreConfigService } from '@core/services/config.service';
import { User } from 'app/auth/models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BienvenidoService } from '../bienvenido/bienvenido.service';
import { ParametrizacionesService } from '../../servicios/parametrizaciones.service';
import { GanarSuperMoneda } from '../../models/supermonedas';

@Component({
  selector: 'app-felicidades-registro',
  templateUrl: './felicidades-registro.component.html',
  styleUrls: ['./felicidades-registro.component.scss']
})
export class FelicidadesRegistroComponent implements OnInit {
  public usuario: User;
  public coreConfig: any;
  public superMonedas: GanarSuperMoneda;
  public ganarMonedas;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _coreConfigService: CoreConfigService,
    private _bienvenidoService: BienvenidoService,
    private _coreMenuService: CoreMenuService,
    private _router: Router,
    private paramService: ParametrizacionesService,

  ) {
    this.usuario = this._coreMenuService.grpPersonasUser;

    this.superMonedas = this.inicializarSuperMoneda();

    this._unsubscribeAll = new Subject();

    this._coreConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        menu: {
          hidden: true
        },
        customizer: false,
        enableLocalStorage: false
      }
    };
  }
  inicializarSuperMoneda(): GanarSuperMoneda {
    return {
      credito: 0,
      descripcion: "",
      tipo: "Credito",
      user_id: this.usuario.id
    }
  }
  ngOnInit(): void {
    this.usuario = this._coreMenuService.grpPersonasUser;
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });
    this.paramService.obtenerParametroNombreTipo("monedas_registro", "GANAR_SUPERMONEDAS").subscribe((info) => {
      this.ganarMonedas = info;
      this.superMonedas.credito = this.ganarMonedas.valor;
      this.superMonedas.descripcion = "Gana " + this.ganarMonedas.valor + " supermonedas por completar perfil";
    });
  }

  empezar() {
    this._bienvenidoService.cambioDeEstado(
      {
        estado: "5",
        id: this.usuario.id
      }
    ).subscribe(info => {
      this.usuario.estado = "5";
      localStorage.setItem('grpPersonasUser', JSON.stringify(this.usuario));
      setTimeout(() => {
        this._router.navigate(['/']);
      }, 100);
    });
  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
