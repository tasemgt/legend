import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BankTransferConfirmPage } from './bank-transfer-confirm.page';
import { ToNumberPipe } from 'src/app/pipes/to-number.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [BankTransferConfirmPage, ToNumberPipe],
  entryComponents: [BankTransferConfirmPage]
})
export class BankTransferConfirmPageModule {}
