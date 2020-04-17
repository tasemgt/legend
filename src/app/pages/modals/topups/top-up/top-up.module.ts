import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TopUpPage } from './top-up.page';

import { FundWalletPageModule } from '../fund-wallet/fund-wallet.module';



@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    FundWalletPageModule
  ],
  declarations: [TopUpPage],
  entryComponents: [TopUpPage]
})
export class TopUpPageModule {}
