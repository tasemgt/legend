import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AllMerchantsPage } from './all-merchants.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [AllMerchantsPage],
  entryComponents: [AllMerchantsPage]
})
export class AllMerchantsPageModule {}
