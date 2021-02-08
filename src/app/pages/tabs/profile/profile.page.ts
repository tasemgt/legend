import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { User, Profile } from 'src/app/models/user';
import { UtilService } from 'src/app/services/util.service';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

import { EditProfilePage } from '../../modals/profile/edit-profile/edit-profile.page';
import { ModalController, LoadingController } from '@ionic/angular';
import { myEnterAnimation, myEnterAnimation2 } from 'src/app/animations/enter';
import { myLeaveAnimation } from 'src/app/animations/leave';
import { QrCodePage } from '../../modals/profile/qr-code/qr-code.page';


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
    private utilService: UtilService,
    private loadingCtrl: LoadingController) {}

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
      else{
        setTimeout(() =>{ //Fixes null display bug before page redirects to login
          this.profile = {} as Profile;
          this.user = {} as User;
        },100)
      }
    });
  }

  // ionViewDidEnter(){
  //   setTimeout(async () =>{
  //     const user = await this.authService.getUser();
  //     this.authService.checkTokenExpiry(user);
  //   }, 200);
  // }

  private async getUserProfile(user: User){
    try{
      this.profile = await this.userService.getUserProfile(user);
    }
    catch(err){
      if(err.status === 0){
        setTimeout(() => {
          this.getUserProfile(user);
        }, 5000);
      }
    }
  }

  public async openEditProfileModal(){
    // this.router.navigateByUrl('/edit-profile');
    const modal = await this.modalCtrl.create({
      component: EditProfilePage,
      enterAnimation: myEnterAnimation,
      leaveAnimation: myLeaveAnimation,
      componentProps: {'profile': this.profile, 'user': this.user}
    });
    await modal.present();
    const {data} = await modal.onDidDismiss();
    if(data){
      this.profile = data.profile;
    }
  }

  public async openQRCodeModal(){
    const modal = await this.modalCtrl.create({
      component: QrCodePage,
      enterAnimation: myEnterAnimation2,
      componentProps: {'profile': this.profile}
    });
    await modal.present();
  }

  public logout(){
    this.utilService.presentAlertConfirm('Log Out', 
    `This action will log you out of Legend Pay App. <br><br> Proceed ?`, () =>{
      this.presentLoading('Logging you out...')
        .then(() =>{
          return this.authService.logout(this.user);
        })
        .then((resp) =>{
          //
        })
        .catch((err) =>{
          console.log(err);
        });
    });
  }


  public async presentLoading(message: string){
    const loading = await this.loadingCtrl.create({
      message,
      translucent: true,
    });
    return loading.present();
  }

  
  ngOnDestroy(){
    this.authSubscription.unsubscribe();
  }
}
