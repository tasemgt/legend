import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BankTransferPage } from './bank-transfer.page';
import { BankTransferConfirmPageModule } from '../bank-transfer-confirm/bank-transfer-confirm.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BankTransferConfirmPageModule
  ],
  declarations: [BankTransferPage],
  entryComponents: [BankTransferPage]
})
export class BankTransferPageModule {}
