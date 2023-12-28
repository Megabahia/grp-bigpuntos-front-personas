import {Component, OnInit} from '@angular/core';

/**
 * Bigpuntos
 * PErsonas
 * ESta pantalla sirve para mostrar informacion en donde canjear
 * Rutas:
 * No tiene llamado de rutas
 */

@Component({
    selector: 'app-donde-canjear',
    template: `
        <div class="row align-items-center py-2">
            <div class="row">
                <div class="text-center col-md-12 m-1">
                    <h1 class="azul2 text-bold">PUNTOS DE CANJE:
                    </h1>
                </div>
                <div class="card-group">
                    <div class="card">
                        <img src="assets/images/direcciones/mega-bahia2.png" class="card-img-top">
                        <div class="card-body">
                            <h5 class="card-title">Quito, sector Centro Norte</h5>
                            <p class="card-text">
                                Dir: Av. 10 de Agosto N39-201 y José Arizaga, Sector La Y, frente al Hipermercado CORAL y
                                junto
                                a la Clínica AXXIS., Quito, Ecuador.
                            </p>
                        </div>
                    </div>
                    <div class="card">
                        <img src="assets/images/direcciones/vittoria2.png" class="card-img-top">
                        <div class="card-body">
                            <h5 class="card-title">Quito, sector Centro Norte</h5>
                            <p class="card-text">
                                Dir: Selva Alegre OE 4-65 y Gaspar de Carvajal 170521 Quito, Ecuador.
                            </p>
                        </div>
                    </div>
                    <div class="card">
                        <img src="assets/images/direcciones/mega-barato2.png" class="card-img-top">
                        <div class="card-body">
                            <h5 class="card-title">Quito, sector Sur</h5>
                            <p class="card-text">
                                Dir: Teniente Hugo Ortiz S25-79 y Av. Solanda, diagonal a la parada del trole Quimiag.
                                170131 Quito, Ecuador.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    styleUrls: ['./donde-canjear.component.scss']
})
export class DondeCanjearComponent implements OnInit {

    constructor() {
    }

    ngOnInit(): void {
    }

}
