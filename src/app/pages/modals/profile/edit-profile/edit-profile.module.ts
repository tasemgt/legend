import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { EditProfilePage } from './edit-profile.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [EditProfilePage],
  entryComponents: [EditProfilePage]
})
export class EditProfilePageModule {}
