import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { WalletPage } from './wallet.page';

import { SelectMerchantPageModule } from '../../modals/payments/select-merchant/select-merchant.module';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectMerchantPageModule,
    RouterModule.forChild([{ path: '', component: WalletPage }]),
  ],
  declarations: [WalletPage]
})
export class WalletPageModule {}
