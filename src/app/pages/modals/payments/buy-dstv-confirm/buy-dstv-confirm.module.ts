import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BuyDstvConfirmPage } from './buy-dstv-confirm.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [BuyDstvConfirmPage],
  entryComponents: [BuyDstvConfirmPage]
})
export class BuyDstvConfirmPageModule {}
