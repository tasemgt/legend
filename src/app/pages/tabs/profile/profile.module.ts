import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfilePage } from './profile.page';

import { EditProfilePageModule } from '../../modals/profile/edit-profile/edit-profile.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: ProfilePage }]),
    EditProfilePageModule
  ],
  declarations: [ProfilePage],
})
export class ProfilePageModule {}
