import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { WalletPage } from './wallet.page';

import { SelectMerchantPageModule } from '../../modals/payments/select-merchant/select-merchant.module';
import { SearchUserTransferPageModule } from '../../modals/transfer/search-user-transfer/search-user-transfer.module';
import { TopUpPageModule } from '../../modals/topups/top-up/top-up.module';





@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectMerchantPageModule,
    SearchUserTransferPageModule,
    TopUpPageModule,
    RouterModule.forChild([{ path: '', component: WalletPage }]),
  ],
  declarations: [WalletPage]
})
export class WalletPageModule {}
