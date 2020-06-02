import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectServicePage } from './select-service.page';
import { ServiceDetailsPageModule } from '../service-details/service-details.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServiceDetailsPageModule
  ],
  declarations: [SelectServicePage],
  entryComponents: [SelectServicePage]
})
export class SelectServicePageModule {}
