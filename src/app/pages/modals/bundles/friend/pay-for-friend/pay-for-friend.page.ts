import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, LoadingController } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';
import { PayForFriendService } from 'src/app/services/pay-for-friend.service';
import { WalletService } from 'src/app/services/wallet.service';

@Component({
  selector: 'app-pay-for-friend',
  templateUrl: './pay-for-friend.page.html',
  styleUrls: ['./pay-for-friend.page.scss'],
})
export class PayForFriendPage implements OnInit {

  public productInfo: any;
  public chosenSub: any;

  // customActionSheetOptions: any = {
  //   header: 'Select service plan',
  // };

  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private navParams: NavParams,
    private utilService: UtilService,
    private payForFriend: PayForFriendService,
    private walletService: WalletService) {

      this.productInfo = this.navParams.get('productInfo');
  }

  ngOnInit() {
  }

  public makePayment(){
    if(!this.chosenSub){
      this.utilService.showToast('Please select a service to pay for your friend friend', 2000, 'danger');
      return;
    }

    const payload = {username:this.productInfo.username, type:this.productInfo.type};

    this.utilService.presentAlertConfirm('Pay For Friend', 
    `Confirm payment for <strong>${this.chosenSub.products_name}</strong> ?`, 
      () =>{
        this.utilService.presentLoading('Purchasing service plan..')
          .then(() =>{
            return this.payForFriend.makePayment(payload, this.chosenSub.products_id);
          })
          .then((resp) =>{
            this.loadingCtrl.dismiss();
            if(resp.code === 100){
              this.utilService.showToast(resp.message, 3000, 'success');
              this.walletService.balanceState.next(true);
              return this.closeModal();
            }
            else if(resp.code === 418){
              this.utilService.showToast(`${resp.message}`, 3000, 'danger');
              return;
            }
            else{
              this.utilService.showToast(`Transaction failed`, 2000, 'danger');
              return;
            }
          })
          .catch((error) =>{
            this.loadingCtrl.dismiss();
            this.utilService.showToast(`Transaction failed`, 2000, 'danger');
          });
      }, 'Cancel', 'Confirm');
  
  }

  public formatWithCommas(num: any){
    return this.utilService.numberWithCommas(num);
  }

  public closeModal(){
    this.modalCtrl.dismiss();
  }

}
