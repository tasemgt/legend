import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { BundleDetailsPageModule } from '../../modals/bundles/bundle-details/bundle-details.module';
import { RewardsPageModule } from '../../modals/rewards/rewards.module';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    BundleDetailsPageModule,
    RewardsPageModule,
    RouterModule.forChild([{ path: '', component: HomePage }])
  ],
  declarations: [HomePage]
})
export class HomePageModule {}