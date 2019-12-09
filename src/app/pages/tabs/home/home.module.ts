import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { BuyBundlePage } from '../../modals/buy-bundle/buy-bundle.page';
import { BundleTypesPage } from '../../modals/bundle-types/bundle-types.page';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: HomePage }])
  ],
  declarations: [HomePage, BuyBundlePage, BundleTypesPage],
  entryComponents: [BuyBundlePage, BundleTypesPage]
})
export class HomePageModule {}