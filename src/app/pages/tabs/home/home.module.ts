import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { BuyBundlePage } from '../../modals/buy-bundle/buy-bundle.page';
import { BundleTypesPage } from '../../modals/bundle-types/bundle-types.page';
import { BundleDetailsPage } from '../../modals/bundle-details/bundle-details.page';
import { RenewBundlePage } from '../../modals/renew-bundle/renew-bundle.page';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: HomePage }])
  ],
  declarations: [HomePage, BuyBundlePage, BundleDetailsPage, BundleTypesPage, RenewBundlePage],
  entryComponents: [BuyBundlePage, BundleDetailsPage, BundleTypesPage, RenewBundlePage]
})
export class HomePageModule {}