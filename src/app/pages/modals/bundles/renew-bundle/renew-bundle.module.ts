import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { RenewBundlePage } from './renew-bundle.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [RenewBundlePage],
  entryComponents: [RenewBundlePage]
})
export class RenewBundlePageModule {}
