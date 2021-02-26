import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { WalletPage } from './wallet.page';
import { SelectMerchantPageModule } from '../../modals/purchases/select-merchant/select-merchant.module';
import { SearchUserTransferPageModule } from '../../modals/transfer/search-user-transfer/search-user-transfer.module';
import { TopUpPageModule } from '../../modals/topups/top-up/top-up.module';
import { SeeAllPageModule } from '../../modals/transactions/see-all/see-all.module';
import { SelectServicePageModule } from '../../modals/payments/select-service/select-service.module';
import { BankTransferPageModule } from '../../modals/transfer/bank-transfer/bank-transfer.module';
import { BvnVerificationPageModule } from '../../modals/transfer/bvn-verification/bvn-verification.module';






@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectMerchantPageModule,
    SearchUserTransferPageModule,
    BankTransferPageModule,
    BvnVerificationPageModule,
    TopUpPageModule,
    SelectServicePageModule,
    SeeAllPageModule,
    RouterModule.forChild([{ path: '', component: WalletPage }]),
  ],
  declarations: [WalletPage]
})
export class WalletPageModule {}
