import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BienvenidoService } from '../bienvenido/bienvenido.service';
import { takeUntil } from 'rxjs/operators';
import { CompletarPerfilService } from './completar-perfil.service';
import { FlatpickrOptions } from 'ng2-flatpickr';
import { CoreConfigService } from '../../../../../@core/services/config.service';
import { CoreMenuService } from '../../../../../@core/components/core-menu/core-menu.service';
import { CompletarPerfil } from '../../models/persona';

@Component({
  selector: 'app-completar-perfil',
  templateUrl: './completar-perfil.component.html',
  styleUrls: ['./completar-perfil.component.scss']
})
export class CompletarPerfilComponent implements OnInit {
  @ViewChild('startDatePicker') startDatePicker;

  public informacion: CompletarPerfil;
  public coreConfig: any;
  public imagen;
  public registerForm: FormGroup;
  public loading = false;
  public submitted = false;

  public startDateOptions = {
    altInput: true,
    mode: 'single',
    // altInputClass: 'form-control flat-picker flatpickr-input invoice-edit-input',
  };
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
    private _completarPerfilService: CompletarPerfilService,
    private _formBuilder: FormBuilder,

  ) {
    this.informacion = {
      apellidos: "",
      user_id: "", 
      edad: 0, 
      fechaNacimiento: "", 
      genero: "", 
      identificacion: "", 
      nombres: "", 
      whatsapp: ""
    }
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
  get f() {
    return this.registerForm.controls;
  }

  /**
   * On init
   */
  ngOnInit(): void {
    this.registerForm = this._formBuilder.group({
      identificacion: ['', [Validators.required]],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      genero: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      edad: ['', Validators.required],
      whatsapp: ['', Validators.required],
    });
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
      this._completarPerfilService.subirImagenRegistro(usuario.id, imagen).subscribe((info) => {
        console.log(info);
      });
    }
  }
  calcularEdad() {

  }
  guardarRegistro() {
    let usuario = this._coreMenuService.currentUser;
    this.submitted = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    console.log(this.registerForm);
    this.informacion.apellidos = this.f.apellidos.value;
    this.informacion.edad = this.f.edad.value;;
    this.informacion.fechaNacimiento = this.f.fechaNacimiento.value;;
    this.informacion.genero = this.f.genero.value;;
    this.informacion.identificacion = this.f.identificacion.value;;
    this.informacion.nombres = this.f.nombres.value;;
    this.informacion.whatsapp = this.f.whatsapp.value;;
    this.informacion.user_id = this.f.user_id.value;;
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
