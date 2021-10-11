import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { CompartirPublicacionesService } from './compartir-publicaciones.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-compartir-publicaciones',
  templateUrl: './compartir-publicaciones.component.html',
  styleUrls: ['./compartir-publicaciones.component.scss'],
  providers: [DatePipe]
})
export class CompartirPublicacionesComponent implements OnInit {
  public page = 1;
  public page_size: any = 10;
  public maxSize;
  public collectionSize;
  public publicaciones;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _compartirPublicacionesService: CompartirPublicacionesService,
    private datePipe: DatePipe,

  ) {
    this._unsubscribeAll = new Subject();

  }

  ngOnInit(): void {
  }
  ngAfterViewInit() {

    this.obtenerListaPublicaciones();
  }

  obtenerListaPublicaciones() {
    this._compartirPublicacionesService.obtenerPublicaciones({
      page: this.page - 1, page_size: this.page_size
    }).subscribe(info => {
      this.publicaciones = info.info;
      this.collectionSize = info.cont;
    });
  }
  obtenerMes(fecha) {
    let nuevaFecha = this.datePipe.transform(fecha, 'MMM');
    return nuevaFecha;
  }
  obtenerDia(fecha) {
    let nuevaFecha = this.datePipe.transform(fecha, 'd');
    return nuevaFecha;
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
