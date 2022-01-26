import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { PerfilUsuarioService } from './perfil-usuario.service';
import { User } from '../../../auth/models/user';
import { CoreMenuService } from '../../../../@core/components/core-menu/core-menu.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { InformacionBasica } from '../../personas/models/persona';
import { DatePipe } from '@angular/common';
import moment from 'moment';
import { FlatpickrOptions } from 'ng2-flatpickr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BienvenidoService } from '../../personas/vistas/bienvenido/bienvenido.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.scss'],
  providers: [DatePipe]
})
export class PerfilUsuarioComponent implements OnInit {
  @ViewChild('mensajeModal') mensajeModal;

  public tab;
  public usuario: User;
  public coreConfig: any;
  public personaForm: FormGroup;
  public informacionBasica: InformacionBasica;
  public persona;
  public imagen;
  public mensaje = "";
  public imagenTemp;
  public fecha;
  public validado = false;
  public startDateOptions: FlatpickrOptions = {
    altInput: true,
    mode: 'single',
    altFormat: 'Y-n-j',
    altInputClass: 'form-control flat-picker flatpickr-input invoice-edit-input',
  };
  // Private
  private _unsubscribeAll: Subject<any>;
  constructor(
    private _perfilUsuarioService: PerfilUsuarioService,
    private _coreMenuService: CoreMenuService,
    private _formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private _modalService: NgbModal,
    private _bienvenidoService: BienvenidoService,
    private _router: Router,

  ) {
    this.informacionBasica = {
      ciudad: "",
      edad: 0,
      emailAdicional: "",
      facebook: "",
      fechaNacimiento: "",
      genero: "",
      instagram: "",
      tiktok: "",
      twitter: "",
      whatsapp: "",
      youtube: "",
      user_id: ""
    }
    this._unsubscribeAll = new Subject();

  }
  get f() {
    return this.personaForm.controls;
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
    this.usuario = this._coreMenuService.grpPersonasUser;
    this._perfilUsuarioService.obtenerInformacion(this.usuario.id).subscribe(info => {
      this.imagen = info.imagen;
      if (info.identificacion) {
        this.validado = true;
      }
      info.created_at = this.transformarFecha(info.created_at);
      info.fechaNacimiento = this.transformarFecha(info.fechaNacimiento);
      this.fecha = this.transformarFecha(info.fechaNacimiento);
      this.personaForm.patchValue(
        info,
      );
    });
  }
  transformarFecha(fecha) {
    let nuevaFecha = this.datePipe.transform(fecha, 'yyyy-MM-dd');
    return nuevaFecha;
  }
  omitirContinuar() {
    let usuario = this._coreMenuService.grpPersonasUser;
    this._bienvenidoService.cambioDeEstado(
      {
        estado: "6",
        id: usuario.id
      }
    ).subscribe((info) => {
      usuario.estado = "6";
      localStorage.setItem('grpPersonasUser', JSON.stringify(usuario));
      setTimeout(() => {
        window.location.href = "/";
      }, 100);
    });


    // redirect to home page
  }
  guardarInformacion() {
    if (!this.validado) {
      this.mensaje = "Es necesario validar el usuario";
      this.abrirModal(this.mensajeModal);
    }
    this.informacionBasica = { ...this.personaForm.value, fechaNacimiento: this.informacionBasica.fechaNacimiento };
    this.informacionBasica.user_id = this.usuario.id;
    if (!this.informacionBasica.fechaNacimiento) {
      delete this.informacionBasica.fechaNacimiento;
    }
    if (!this.informacionBasica.whatsapp) {
      delete this.informacionBasica.whatsapp;
    }
    this._perfilUsuarioService.guardarInformacion(this.informacionBasica).subscribe(info => {
      this.usuario.persona = info;
      localStorage.setItem("grpPersonasUser", JSON.stringify(this.usuario));
      this.mensaje = "Información guardada correctamente"
      this.abrirModal(this.mensajeModal);
    });

  }
  calcularEdad() {
    this.informacionBasica.edad = moment().diff(this.f.fechaNacimiento.value[0], 'years');
    this.informacionBasica.fechaNacimiento = moment(this.f.fechaNacimiento.value[0]).format('YYYY-MM-DD');
    this.personaForm.patchValue({
      edad: this.informacionBasica.edad
    });
  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  async subirImagen(event) {

    if (event.target.files && event.target.files[0]) {
      let imagen = event.target.files[0];
      let nuevaImagen = new FormData();
      nuevaImagen.append('imagen', imagen, imagen.name);


      this._perfilUsuarioService.guardarImagen(nuevaImagen, this.usuario.id).subscribe((data) => {
        let reader = new FileReader();

        reader.onload = (event: any) => {
          this.imagenTemp = event.target.result;
        };

        reader.readAsDataURL(event.target.files[0]);
        this.mensaje = "Imagen guardada correctamente"
        this.abrirModal(this.mensajeModal);
      },
        (error) => {
          this.mensaje = "Error al guardar imagen"
          this.abrirModal(this.mensajeModal);
        });
    }
  }
  abrirModal(modal) {
    this._modalService.open(modal);
  }
  cerrarModal() {
    this._modalService.dismissAll();
  }
}
