import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServiceDetailsPage } from './service-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [ServiceDetailsPage],
  entryComponents: [ServiceDetailsPage]
})
export class ServiceDetailsPageModule {}
