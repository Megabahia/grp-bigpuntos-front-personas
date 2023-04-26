import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NeedHelpComponent} from "./need-help/need-help.component";
import { NeedInfoComponent } from './need-info/need-info.component';



@NgModule({
  declarations: [
    NeedHelpComponent,
    NeedInfoComponent,
  ],

  exports: [
    NeedHelpComponent,
    NeedInfoComponent
  ],

  imports: [
    CommonModule,
  ]
})
export class SharedModule { }
