import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { UtilService } from 'src/app/services/util.service';
import { Profile, User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  public profile: Profile;
  public user: User;

  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private navParams: NavParams,
    private utilService: UtilService,
    private userService: UserService) {

      this.profile = this.navParams.get('profile');
      this.user = this.navParams.get('user');

    }

  ngOnInit() {
  }

  public updateProfile(form: NgForm){ 

    console.log(form.value.email, form.value.phone);
    if(form.invalid){
      this.utilService.showToast('Form cannot contain empty fields.', 2000, 'danger');
      return;
    }
    if(!this.utilService.validateEmail(form.value.email)){
      this.utilService.showToast('Please enter a valid email.', 2000, 'danger');
      return;
    }
    if(!this.utilService.validatePhone(form.value.phone)){
      this.utilService.showToast('Please enter a valid phone number (13 digits).', 2000, 'danger');
      return;
    }

    this.utilService.presentLoading('Funding your wallet.')
      .then(() =>{
        console.log(this.user, form.value.email, form.value.phone);
        return this.userService.updateUserProfile(this.user, {email:form.value.email, phone:form.value.phone});
      })
      .then((resp) =>{
        this.loadingCtrl.dismiss();
        if(resp.code === 100){
          return this.userService.getUserProfile(this.user);
        }
        else if(resp.code === 418){
          this.utilService.showToast(`${resp.message}`, 3000, 'danger');
        }
        else{
          this.utilService.showToast(`Profile update failed`, 2000, 'danger');
        }
      })
      .then((profile) =>{
        this.utilService.showToast(`Profile updated successfully`, 3000, 'secondary');
        this.closeModal(profile);
      })
  }

  public closeModal(profile?: Profile){
    this.modalCtrl.dismiss({profile});
  }
}
