import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BvnVerificationPage } from './bvn-verification.page';
import { BankTransferPageModule } from '../bank-transfer/bank-transfer.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BankTransferPageModule
  ],
  declarations: [BvnVerificationPage],
  entryComponents: [BvnVerificationPage]
})
export class BvnVerificationPageModule {}
