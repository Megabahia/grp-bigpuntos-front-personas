import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { CoreConfigService } from '../../../../@core/services/config.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BienvenidoService } from '../bienvenido/bienvenido.service';
import { CoreMenuService } from '../../../../@core/components/core-menu/core-menu.service';
import { takeUntil } from 'rxjs/operators';
import { CompletarPerfilService } from './completar-perfil.service';

@Component({
  selector: 'app-completar-perfil',
  templateUrl: './completar-perfil.component.html',
  styleUrls: ['./completar-perfil.component.scss']
})
export class CompletarPerfilComponent implements OnInit {
  public coreConfig: any;
  public imagen;
  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   */
  constructor(
    private _coreConfigService: CoreConfigService,
    private _coreMenuService: CoreMenuService,
    private _completarPerfilService: CompletarPerfilService
  ) {
    this._unsubscribeAll = new Subject();

    // Configure the layout
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

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to config changes
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });
  }

  subirImagen(event: any) {
    let usuario = this._coreMenuService.currentUser;

    if (event.target.files && event.target.files[0]) {
      let nuevaImagen = event.target.files[0];

      let reader = new FileReader();

      reader.onload = (event: any) => {
        this.imagen = event.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
      let imagen = new FormData();
      imagen.append('imagen', nuevaImagen, nuevaImagen.name);
      console.log(nuevaImagen.name);
      this._completarPerfilService.subirImagenRegistro(usuario.id, imagen).subscribe((info) => {
        console.log(info);
      });
      // if (this. != 0) {
      //   this.clientesService.editarImagen(this.idCliente, imagen).subscribe((info) => {
      //     this.urlImagen = this.obtenerURLImagen(info.imagen);
      //   });
      // }
    }
  }
  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
