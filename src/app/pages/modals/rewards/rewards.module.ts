import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Clipboard } from '@ionic-native/clipboard/ngx';

import { RewardsPage } from './rewards.page';
import { SeeMorePageModule } from './see-more/see-more.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SeeMorePageModule
  ],
  providers: [
    Clipboard
  ],
  declarations: [RewardsPage],
  entryComponents: [RewardsPage]
})
export class RewardsPageModule {}
