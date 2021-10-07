import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { PerfilUsuarioService } from './perfil-usuario.service';
import { User } from '../../../auth/models/user';
import { CoreMenuService } from '../../../../@core/components/core-menu/core-menu.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { InformacionBasica } from '../../personas/models/persona';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.scss'],
  providers: [DatePipe]
})
export class PerfilUsuarioComponent implements OnInit {
  public tab;
  public usuario: User;
  public coreConfig: any;
  public personaForm: FormGroup;
  public informacionBasica: InformacionBasica;
  public persona;
  public imagen;
  // Private
  private _unsubscribeAll: Subject<any>;
  constructor(
    private _perfilUsuarioService: PerfilUsuarioService,
    private _coreMenuService: CoreMenuService,
    private _formBuilder: FormBuilder,
    private datePipe: DatePipe,
  ) {
    this._unsubscribeAll = new Subject();

  }

  ngOnInit(): void {
    this.personaForm = this._formBuilder.group({
      created_at: ['',],
      identificacion: ['',],
      nombres: ['',],
      apellidos: ['',],
      genero: ['',],
      fechaNacimiento: ['string',],
      edad: ['',],
      whatsapp: ['',],
      ciudad: ['',],
      email: ['',],
      emailAdicional: ['',],
      facebook: ['',],
      instagram: ['',],
      twitter: ['',],
      tiktok: ['',],
      youtube: ['',],
    });
    this.usuario = this._coreMenuService.currentUser;
    this._perfilUsuarioService.obtenerInformacion(this.usuario.id).subscribe(info => {
      this.imagen = info.imagen;
      info.created_at = this.transformarFecha(info.created_at);
      info.fechaNacimiento = this.transformarFecha(info.fechaNacimiento);
      this.personaForm.patchValue(
        info,
      );
    });
  }
  transformarFecha(fecha) {
    let nuevaFecha = this.datePipe.transform(fecha, 'yyyy-MM-dd');
    return nuevaFecha;
  }
  guardarInformacion() {
    this.informacionBasica = this.personaForm.value;
    console.log(this.personaForm.value);
  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
