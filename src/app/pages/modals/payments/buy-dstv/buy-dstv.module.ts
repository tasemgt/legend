import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BuyDstvPage } from './buy-dstv.page';
import { BuyDstvConfirmPageModule } from '../buy-dstv-confirm/buy-dstv-confirm.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BuyDstvConfirmPageModule
  ],
  declarations: [BuyDstvPage],
  entryComponents: [BuyDstvPage]
})
export class BuyDstvPageModule {}
