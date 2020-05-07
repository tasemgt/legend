import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectMerchantPage } from './select-merchant.page';
import { SelectProductPageModule } from '../select-product/select-product.module';
import { AllMerchantsPageModule } from './all-merchants/all-merchants.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AllMerchantsPageModule,
    SelectProductPageModule
  ],
  declarations: [SelectMerchantPage],
  entryComponents: [SelectMerchantPage]
})
export class SelectMerchantPageModule {}
