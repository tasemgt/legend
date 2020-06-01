import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RedeemsPage } from './redeems.page';
import { SubscriptionPageModule } from './subscription/subscription.module';
import { MerchantPageModule } from './merchant/merchant.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubscriptionPageModule,
    MerchantPageModule
  ],
  declarations: [RedeemsPage],
  entryComponents: [RedeemsPage]
})
export class RedeemsPageModule {}
