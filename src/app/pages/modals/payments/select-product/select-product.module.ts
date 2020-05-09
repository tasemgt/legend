import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectProductPage } from './select-product.page';
import { PayMerchantPageModule } from '../pay-merchant/pay-merchant.module';
import { AllProductsPageModule } from './all-products/all-products.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AllProductsPageModule,
    PayMerchantPageModule
  ],
  declarations: [SelectProductPage],
  entryComponents: [SelectProductPage]
})
export class SelectProductPageModule {}
