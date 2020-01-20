import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User, Profile } from 'src/app/models/user';
import { UtilService } from 'src/app/services/util.service';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

import { EditProfilePage } from '../../modals/edit-profile/edit-profile.page';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss']
})
export class ProfilePage implements OnInit, OnDestroy{

  public profile: Profile;
  public user: User;
  
  public authSubscription: Subscription;


  constructor(
    private modalCtrl: ModalController,
    private authService: AuthService,
    private userService: UserService,
    private utilService: UtilService) {}

  ngOnInit(){

    this.authSubscription = this.authService.getAuthStateSubject().subscribe((state) =>{
      //Do one time stuff on login here, like get the user again. i.e when state changes from false to true;
      if(state){
        this.authService.getUser().then((user) =>{
          this.user = user;
          this.getUserProfile(user);
        })
        .catch((err) => console.log(err));
      }
    });
  }

  private async getUserProfile(user: User){
    this.profile = await this.userService.getUserProfile(user);
  }

  public async openEditProfileModal(){
    const modal = await this.modalCtrl.create({
      component: EditProfilePage,
      componentProps: {'profile': this.profile, 'user': this.user}
    });
    await modal.present();
    const {data} = await modal.onDidDismiss();
    if(data && data.profile){
      this.profile = data.profile;
    }
  }

  public logout(){
    this.utilService.presentAlertConfirm('Leaving soon?', 'Are you sure you want to log out?', () =>{
      this.authService.logout();
    });
  }

  ngOnDestroy(){
    this.authSubscription.unsubscribe();
  }
}
