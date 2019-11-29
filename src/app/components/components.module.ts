import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { LogComponent } from './log/log.component';


@NgModule({
  declarations: [
    LogComponent
  ],
  imports: [
    IonicModule,
    CommonModule
  ],
  exports: [
    LogComponent
  ]
})
export class ComponentsModule { }
