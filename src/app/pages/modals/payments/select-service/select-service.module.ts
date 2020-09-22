import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectServicePage } from './select-service.page';
import { ServiceDetailsPageModule } from '../service-details/service-details.module';
import { BuyPowerPageModule } from '../buy-power/buy-power.module';
import { BuyDstvPageModule } from '../buy-dstv/buy-dstv.module';
import { BuyAirtimePageModule } from '../buy-airtime/buy-airtime.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServiceDetailsPageModule,
    BuyPowerPageModule,
    BuyDstvPageModule,
    BuyAirtimePageModule
  ],
  declarations: [SelectServicePage],
  entryComponents: [SelectServicePage]
})
export class SelectServicePageModule {}
