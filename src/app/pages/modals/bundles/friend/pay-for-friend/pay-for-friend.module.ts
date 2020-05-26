import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PayForFriendPage } from './pay-for-friend.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [PayForFriendPage],
  entryComponents: [PayForFriendPage]
})
export class PayForFriendPageModule {}
