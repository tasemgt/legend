import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BuyBundlePageRoutingModule } from './buy-bundle-routing.module';

import { BuyBundlePage } from './buy-bundle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BuyBundlePageRoutingModule
  ],
  declarations: [BuyBundlePage]
})
export class BuyBundlePageModule {}
