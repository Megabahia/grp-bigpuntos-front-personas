import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {InicioComponent} from '../../../pages/simulador-automotriz/inicio/inicio.component';
import {SimuladorComponent as SimuladorCreditoAutomotriz} from '../../../pages/simulador-automotriz/simulador/simulador.component';
import {RequisitosComponent} from '../../../pages/simulador-automotriz/requisitos/requisitos.component';
import {ExplicacionCreditoAutomotrizComponent} from './explicacion-credito-automotriz/explicacion-credito-automotriz.component';

const routes: Routes = [
  {path: '', redirectTo: 'explicacion', pathMatch: 'full'},
  {
    path: 'explicacion',
    component: ExplicacionCreditoAutomotrizComponent,
    data: {animation: 'misc'},
  },
  {
    path: 'solicitud',
    component: SimuladorCreditoAutomotriz,
    data: {animation: 'misc'},
  },
  {
    path: 'requisitos',
    component: RequisitosComponent,
    data: {animation: 'misc'},
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreditoAutomotrizRoutingModule { }
