import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SearchUserPageModule } from '../friend/search-user/search-user.module';
import { BundleDetailsPage } from './bundle-details.page';
import { RenewBundlePageModule } from '../renew-bundle/renew-bundle.module';
import { BuyBundlePageModule } from '../buy-bundle/buy-bundle.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RenewBundlePageModule,
    SearchUserPageModule, //Search user to pay for a friend
    BuyBundlePageModule
  ],
  declarations: [BundleDetailsPage],
  entryComponents: [BundleDetailsPage]
})
export class BundleDetailsPageModule {}
