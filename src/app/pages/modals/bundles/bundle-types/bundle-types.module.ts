import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { BundleTypesPage } from './bundle-types.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [BundleTypesPage],
  entryComponents: [BundleTypesPage],
  exports: []
})
export class BundleTypesPageModule {}
