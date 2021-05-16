import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BuyPowerPage } from './buy-power.page';
import { BuyPowerConfirmPageModule } from '../buy-power-confirm/buy-power-confirm.module';
import { BvnVerificationPageModule } from '../../transfer/bvn-verification/bvn-verification.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BuyPowerConfirmPageModule,
    BvnVerificationPageModule
  ],
  declarations: [BuyPowerPage],
  entryComponents: [BuyPowerPage]
})
export class BuyPowerPageModule {}
