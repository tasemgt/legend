import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { UtilService } from 'src/app/services/util.service';
import { Profile, User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  public profile: Profile;

  public tempProfile: Profile;
  public user: User;

  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private navParams: NavParams,
    private auth: AuthService,
    private utilService: UtilService,
    private userService: UserService) {

      //this.profile = this.router.getCurrentNavigation().extras.state.profile;
      this.profile = this.navParams.get('profile');
      this.user = this.navParams.get('user');

      this.tempProfile = {...this.profile}; // To compare to previous profile value...

    }

  ngOnInit() {
   
  }

  public updateProfile(form: NgForm){ 

    if(
      !(this.tempProfile.email !== form.value.email ||
      this.tempProfile.phone !== form.value.phone ||
      this.tempProfile.street !== form.value.street ||
      this.tempProfile.streetname !== form.value.streetname ||
      this.tempProfile.city !== form.value.city))
      {
        this.utilService.showToast('Please edit your profile first', 2000, 'danger');
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

    this.utilService.presentLoading('Updating profile.')
      .then(() =>{
        return this.userService.updateUserProfile(this.user, 
          {email:form.value.email, phone:form.value.phone, street:form.value.street, streetname:form.value.streetname, city:form.value.city}
          );
      })
      .then((resp) =>{
        this.loadingCtrl.dismiss();
        if(resp.code === 100){
          this.userService.getUserProfile(this.user)
            .then((profile) =>{
              this.utilService.showToast(`${resp.message}`, 3000, 'success');
              // this.utilService.showToast(`Profile updated successfully`, 3000, 'success');
              this.closeModal(profile);
            });
        }
        else if(resp.code === 418){
          this.utilService.showToast(`${resp.message}`, 3000, 'danger');
          return;
        }
        else{
          this.utilService.showToast(`Profile update failed`, 2000, 'danger');
          return;
        }
      })
      .catch((error) =>{
        this.loadingCtrl.dismiss();
        this.utilService.showToast(`Profile update failed`, 2000, 'danger');
      });
      
  }

  public closeModal(profile?: Profile){
    profile? this.modalCtrl.dismiss({profile}): this.modalCtrl.dismiss();
  }
}
