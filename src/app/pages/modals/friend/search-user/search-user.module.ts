import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchUserPage } from './search-user.page';
import { PayForFriendPageModule } from '../pay-for-friend/pay-for-friend.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PayForFriendPageModule
  ],
  declarations: [SearchUserPage],
  entryComponents: [SearchUserPage]
})
export class SearchUserPageModule {}
