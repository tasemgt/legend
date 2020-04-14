import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TopUpPage } from './top-up.page';
import { FundWalletPage } from '../fund-wallet/fund-wallet.page';



@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ],
  declarations: [TopUpPage, FundWalletPage],
  entryComponents: [FundWalletPage]
})
export class TopUpPageModule {}
