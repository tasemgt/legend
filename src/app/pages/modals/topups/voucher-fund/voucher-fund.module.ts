import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VoucherFundPage } from './voucher-fund.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [VoucherFundPage],
  entryComponents: [VoucherFundPage]
})
export class VoucherFundPageModule {}
