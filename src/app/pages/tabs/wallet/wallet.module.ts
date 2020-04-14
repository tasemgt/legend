import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { WalletPage } from './wallet.page';


import { PaymentPageModule } from '../../modals/payment/payment.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymentPageModule,
    RouterModule.forChild([{ path: '', component: WalletPage }]),
  ],
  declarations: [WalletPage]
})
export class WalletPageModule {}
