import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { BuyBundlePage } from './buy-bundle.page';
import { BundleTypesPageModule } from '../bundle-types/bundle-types.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BundleTypesPageModule
  ],
  declarations: [BuyBundlePage],
  entryComponents: [BuyBundlePage]
})
export class BuyBundlePageModule {}