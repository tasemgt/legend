import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { UtilService } from 'src/app/services/util.service';
import { PayForFriendService } from 'src/app/services/pay-for-friend.service';
import { PayForFriendPage } from '../pay-for-friend/pay-for-friend.page';
import { myEnterAnimation } from 'src/app/animations/enter';
import { myLeaveAnimation } from 'src/app/animations/leave';

@Component({
  selector: 'app-search-user',
  templateUrl: './search-user.page.html',
  styleUrls: ['./search-user.page.scss'],
})
export class SearchUserPage implements OnInit {

  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private utilService: UtilService,
    private payForFriend: PayForFriendService) { }

  ngOnInit() {
  }

  public searchUser(form: NgForm){
    let username = form.value.username;

    if(form.invalid){
      this.utilService.showToast('Please provide friend\'s username to proceed', 2000, 'danger');
      return;
    }

    this.utilService.presentLoading('Transfering funds..')
      .then(() =>{
        return this.payForFriend.searchUser(username);
      })
      .then((resp) =>{
        this.loadingCtrl.dismiss();
        if(resp.code === 100){
          console.log(resp);
          this.openPayForFriendModal(resp);
          return;
        }
        else if(resp.code === 418){
          this.utilService.showToast(`${resp.message}`, 3000, 'danger');
          return;
        }
        else{
          this.utilService.showToast(`Ooops! Cannot find user..`, 2000, 'danger');
          return;
        }
      })
      .catch((error) =>{
        this.loadingCtrl.dismiss();
        console.log(error);
        this.utilService.showToast(`${error.error.errors.username}`, 2000, 'danger');
      });
  }

  public async openPayForFriendModal(productInfo: any){
    const modal = await this.modalCtrl.create({
      component: PayForFriendPage,
      enterAnimation: myEnterAnimation,
      leaveAnimation: myLeaveAnimation,
      componentProps: {productInfo}
    });
    await modal.present();
  }

  public closeModal(){
    this.modalCtrl.dismiss();
  }

}
