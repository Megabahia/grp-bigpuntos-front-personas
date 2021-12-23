import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { takeUntil } from 'rxjs/operators';
import { FlatpickrOptions } from 'ng2-flatpickr';
import moment from 'moment';
import { CoreConfigService } from '../../../../../../@core/services/config.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CreditosAutonomosService } from '../creditos-autonomos.service';
import { CoreMenuService } from '../../../../../../@core/components/core-menu/core-menu.service';

@Component({
  selector: 'app-perfil-persona-aut',
  templateUrl: './perfil-persona.component.html',
  styleUrls: ['./perfil-persona.component.scss']
})
export class PerfilPersonaAutComponent implements OnInit {
  @Output() estado = new EventEmitter<number>();
  @ViewChild('startDatePicker') startDatePicker;
  @ViewChild('whatsapp') whatsapp;
  public error;
  // public informacion: CompletarPerfil;
  public coreConfig: any;
  public imagen;
  public registerForm: FormGroup;
  public loading = false;
  public submitted = false;
  public usuario;
  // public usuario: User;
  public startDateOptions: FlatpickrOptions = {
    altInput: true,
    mode: 'single',
    altFormat: 'Y-n-j',
    altInputClass: 'form-control flat-picker flatpickr-input invoice-edit-input',
  };
  public codigo;
  public fecha;
  // Private
  private _unsubscribeAll: Subject<any>;
  public video;
  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   */
  constructor(
    private _coreConfigService: CoreConfigService,
    private sanitizer: DomSanitizer,

    private _coreMenuService: CoreMenuService,
    private _creditosAutonomosService: CreditosAutonomosService,
    // private _bienvenidoService: BienvenidoService,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private modalService: NgbModal
  ) {
    this.usuario = this._coreMenuService.grpPersonasUser;
  
    this.video = {
      url: "https://www.youtube.com/embed/aK52RxV2XuI"
    };
    // this.informacion = {
    //   apellidos: "",
    //   user_id: "",
    //   edad: 0,
    //   fechaNacimiento: "",
    //   genero: "",
    //   identificacion: "",
    //   nombres: "",
    //   whatsapp: ""
    // }
    this._unsubscribeAll = new Subject();

    // Configure the layout
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
      fechaNacimiento: ['string', Validators.required],
      edad: ['', Validators.required],
      whatsapp: ['', Validators.required],
    });
    // Subscribe to config changes
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });

  }
  ngAfterViewInit(): void {
    this._creditosAutonomosService.obtenerInformacion(this.usuario.id).subscribe((info)=>{
      console.log(info);
    }); 
  }

  obtenerURL() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.video.url);
  }

  guardarRegistro() {

    this.submitted = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
  }
  modalWhatsapp(modalVC) {
    this.modalService.open(modalVC);
  }
  continuar() {
    this.estado.emit(3);
  }
  validarWhatsapp() {

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
