import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BuyBundlePage } from './buy-bundle.page';
import { BundleTypesPage } from '../bundle-types/bundle-types.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [BuyBundlePage]
})
export class BuyBundlePageModule {}