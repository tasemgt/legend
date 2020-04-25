import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchUserTransferPage } from './search-user-transfer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [SearchUserTransferPage],
  entryComponents: [SearchUserTransferPage]
})
export class SearchUserTransferPageModule {}
