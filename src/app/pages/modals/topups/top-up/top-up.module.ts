import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TopUpPage } from './top-up.page';

import { FundWalletPageModule } from '../fund-wallet/fund-wallet.module';
import { VoucherFundPageModule } from '../voucher-fund/voucher-fund.module';



@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    FundWalletPageModule,
    VoucherFundPageModule
  ],
  declarations: [TopUpPage],
  entryComponents: [TopUpPage]
})
export class TopUpPageModule {}
