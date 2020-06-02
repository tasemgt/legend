import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, NavParams, LoadingController } from '@ionic/angular';
import { Redeem, Reward, RedeemSub, RedeemMerchant } from 'src/app/models/reward';
import { RewardsService } from 'src/app/services/rewards.service';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionPage } from './subscription/subscription.page';
import { myEnterAnimation } from 'src/app/animations/enter';
import { myLeaveAnimation } from 'src/app/animations/leave';
import { MerchantPage } from './merchant/merchant.page';
import { WalletService } from 'src/app/services/wallet.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-redeems',
  templateUrl: './redeems.page.html',
  styleUrls: ['./redeems.page.scss'],
})
export class RedeemsPage implements OnInit {

  public redeems: Redeem[];
  public rewards: Reward;

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private rewardsService: RewardsService,
    private walletService: WalletService,
    private utilService: UtilService,
    private loadingCtrl: LoadingController) {

      this.redeems = this.navParams.get('redeems');
      this.rewards =  this.navParams.get('rewards');
  }

  ngOnInit() {
  }


  public onRedeemItem(item: Redeem): void{
    let type = item.type.toLowerCase();
    
    if(type === 'renewal' || type === 'fund'){
      //Handle immediately
      this.immediateRedeemHandler(item);
    }

    else if(type === 'subscribe' ){
      //Subscribe page
      this.utilService.presentLoading('')
        .then(() =>{
          return this.rewardsService.getRedeems(item.id);
        })
        .then((redeemSub: RedeemSub) =>{
          this.loadingCtrl.dismiss();
          this.openSubscriptionModal(redeemSub);
        })
        .catch((err) =>{
          this.loadingCtrl.dismiss();
          console.log(err);
        });
    }

    else if( type === 'merchant' ){
      // Merchant Page
      this.utilService.presentLoading('')
        .then(() =>{
          return this.rewardsService.getRedeems(item.id);
        })
        .then((redeemMerchant: RedeemMerchant) =>{
          this.loadingCtrl.dismiss();
          this.openRedeemMerchatModal(redeemMerchant);
        })
        .catch((err) =>{
          this.loadingCtrl.dismiss();
          console.log(err);
        });
    }

  }

  //Modal Redeem Subscribe
  public async openSubscriptionModal(redeemSub: RedeemSub){
    const modal = await this.modalCtrl.create({
      component: SubscriptionPage,
      enterAnimation: myEnterAnimation,
      leaveAnimation: myLeaveAnimation,
      componentProps: {'redeemSub': redeemSub, 'rewardPoints': this.rewards.point}
    });
    await modal.present();
    const {data} = await modal.onDidDismiss();
    if(data){
      setTimeout(() => {
        data.closeParent? this.closeModal(): '';
      },0);
    }
  }


  //Modal Redeem Merchant
  public async openRedeemMerchatModal(redeemMerchant: RedeemMerchant){
    const modal = await this.modalCtrl.create({
      component: MerchantPage,
      enterAnimation: myEnterAnimation,
      leaveAnimation: myLeaveAnimation,
      componentProps: {'redeemMerchant': redeemMerchant, 'rewardPoints': this.rewards.point}
    });
    await modal.present();
    const {data} = await modal.onDidDismiss();
    if(data){
      setTimeout(() => {
        data.closeParent? this.closeModal(): '';
      },0);
    }
  }

  private immediateRedeemHandler(item: Redeem): void{
    this.utilService.presentAlertConfirm(item.desc, 
      `This action will cost <strong>${item.point}</strong> points and is irreversible. 
      <br/>Are you sure you want to redeem this product?`, 
      () =>{

        this.utilService.presentLoading('')
          .then(() =>{
            return this.rewardsService.doRedeem(item.id);
          })
          .then((resp) =>{
            if(resp.code === 100){
              this.loadingCtrl.dismiss();
              this.utilService.showToast(resp.message, 3000, 'success');
              this.walletService.balanceState.next(true);
              this.rewardsService.rewardState.next(true);
              this.closeModal();
            }
            else if(resp.code === 418){
              this.utilService.showToast(resp.message, 3000, 'danger');
              this.loadingCtrl.dismiss();
            }
          })
          .catch((err) =>{
            if(err.status === 500){
              this.utilService.showToast(`Cannot reach server, try again later`, 3000, 'danger');
              this.loadingCtrl.dismiss();
            }
          });

      }, 'Cancel', 'Redeem')
  }

  public closeModal(){
    this.modalCtrl.dismiss();
  }

}
