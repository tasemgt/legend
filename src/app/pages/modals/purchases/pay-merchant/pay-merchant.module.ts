import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PayMerchantPage } from './pay-merchant.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [PayMerchantPage],
  entryComponents: [PayMerchantPage]
})
export class PayMerchantPageModule {}
