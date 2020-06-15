import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BuyPowerConfirmPage } from './buy-power-confirm.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [BuyPowerConfirmPage],
  entryComponents: [BuyPowerConfirmPage]
})
export class BuyPowerConfirmPageModule {}
