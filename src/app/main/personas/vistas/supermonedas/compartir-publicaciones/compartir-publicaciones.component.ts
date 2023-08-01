import {Component, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {CompartirPublicacionesService} from './compartir-publicaciones.service';
import {DatePipe} from '@angular/common';
import {CoreMenuService} from '../../../../../../@core/components/core-menu/core-menu.service';
import {ParametrizacionesService} from 'app/main/personas/servicios/parametrizaciones.service';
import {GanarSuperMoneda} from 'app/main/personas/models/supermonedas';
import {BienvenidoService} from '../../bienvenido/bienvenido.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-compartir-publicaciones',
    templateUrl: './compartir-publicaciones.component.html',
    styleUrls: ['./compartir-publicaciones.component.scss'],
    providers: [DatePipe],
})
export class CompartirPublicacionesComponent implements OnInit {
    @ViewChild('mensajeModal') mensajeModal;

    public page = 1;
    public page_size: any = 10;
    public maxSize;
    public collectionSize;
    public publicaciones;
    public usuario;
    private _unsubscribeAll: Subject<any>;
    public ganarMonedasFacElec;
    public superMonedasElec: GanarSuperMoneda;
    public empresaId;
    public mensaje = '';
    public tipo: string;

    constructor(
        private modalService: NgbModal,
        private _coreMenuService: CoreMenuService,
        private paramService: ParametrizacionesService,
        private _bienvenidoService: BienvenidoService,
        private _compartirPublicacionesService: CompartirPublicacionesService,
        private datePipe: DatePipe,
        private route: ActivatedRoute
    ) {
        this._unsubscribeAll = new Subject();
        this.usuario = this._coreMenuService.grpPersonasUser;
        this.superMonedasElec = this.inicializarSuperMoneda();
    }

    inicializarSuperMoneda(): GanarSuperMoneda {
        return {
            credito: 0,
            descripcion: '',
            tipo: 'Recompensa',
            user_id: this.usuario.id,
            empresa_id: this.empresaId,
        };
    }

    ngOnInit(): void {
        this.paramService
            .obtenerParametroNombreTipo(
                'monedas_compartir_publicaciones',
                'GANAR_SUPERMONEDAS'
            )
            .subscribe((info) => {
                this.ganarMonedasFacElec = info;
                this.superMonedasElec.credito = this.ganarMonedasFacElec.valor;
                this.superMonedasElec.descripcion =
                    'Gana ' +
                    this.ganarMonedasFacElec.valor +
                    ' por publicación en ' + this.tipo;
            });
        this.obtenerIdEm();
        this.route
          .data
          .subscribe(data => {
              this.tipo = data.tipo;

          });
    }

    cerrarModal() {
        this.modalService.dismissAll();
    }

    obtenerIdEm() {
        this._bienvenidoService
            .obtenerEmpresa({
                nombreComercial: 'Global RedPyme',
            })
            .subscribe(
                (info) => {
                    this.superMonedasElec.empresa_id = info._id;
                },
                (error) => {
                    this.mensaje = 'Ha ocurrido un error';
                    this.abrirModal(this.mensajeModal);
                }
            );
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngAfterViewInit() {
        this.obtenerListaPublicaciones();
    }

    obtenerListaPublicaciones() {
        this._compartirPublicacionesService
            .obtenerPublicaciones({
                user_id: this.usuario.id,
                tipo: this.tipo,
            })
            .subscribe((info) => {
                if (info.info.length === 0) {
                    this.mensaje = 'En las próximas horas podrá ganar más Big Puntos para canjear por fabulosos premios';
                    this.abrirModal(this.mensajeModal);
                }
                this.publicaciones = info.info;
                this.collectionSize = info.cont;
            });
    }

    obtenerEvento(evento, id) {
        // this._bienvenidoService
        //     .guardarSuperMonedas(this.superMonedasElec)
        //     .subscribe(
        //         (infoSM) => {
        //             //  this.loading = false;
        //             this.mensaje =
        //                 'Compartido con éxito, ud ha ganado ' +
        //                 this.ganarMonedasFacElec.valor +
        //                 ' Big Puntos';
        //             this.abrirModal(this.mensajeModal);
        //         },
        //         (error) => {
        //             /*  this.loading = false; */
        //         }
        //     );
        // this.compartirPublicacion(id);
    }

    abrirModal(modal) {
        this.modalService.open(modal);
    }

    obtenerMes(fecha) {
        return this.datePipe.transform(fecha, 'MMM');
    }

    obtenerDia(fecha) {
        return this.datePipe.transform(fecha, 'd');
    }

    compartirPublicacion(id) {
        this._compartirPublicacionesService
            .guardarPublicacion({
                user: this.usuario.id,
                publicacion: id,
            })
            .subscribe((info) => {
                this.obtenerListaPublicaciones();
            });
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
