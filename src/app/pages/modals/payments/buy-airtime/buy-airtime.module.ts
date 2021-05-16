import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BuyAirtimePage } from './buy-airtime.page';
import { BvnVerificationPageModule } from '../../transfer/bvn-verification/bvn-verification.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BvnVerificationPageModule
  ],
  declarations: [BuyAirtimePage],
  entryComponents: [BuyAirtimePage]
})
export class BuyAirtimePageModule {}
