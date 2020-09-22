import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BuyAirtimePage } from './buy-airtime.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [BuyAirtimePage],
  entryComponents: [BuyAirtimePage]
})
export class BuyAirtimePageModule {}
