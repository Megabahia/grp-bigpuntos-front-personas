import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CreditoAutomotrizComponent} from './credito-automotriz.component';

const routes: Routes = [
  {path: '', redirectTo: 'solicitar-credito', pathMatch: 'full'},
  {
    path: 'solicitar-credito',
    component: CreditoAutomotrizComponent,
    // data: {animation: 'misc'},
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreditoAutomotrizRoutingModule { }
