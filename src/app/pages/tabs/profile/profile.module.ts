import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfilePage } from './profile.page';

import {NgxQRCodeModule} from 'ngx-qrcode2';

import { EditProfilePageModule } from '../../modals/profile/edit-profile/edit-profile.module';
import { QrCodePage } from '../../modals/profile/qr-code/qr-code.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: ProfilePage }]),
    EditProfilePageModule,
    NgxQRCodeModule
  ],
  declarations: [ProfilePage, QrCodePage],
  entryComponents: [QrCodePage]
})
export class ProfilePageModule {}
