import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { FundWalletPage } from './fund-wallet.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [FundWalletPage],
  entryComponents: [FundWalletPage]
})
export class FundWalletPageModule {}
