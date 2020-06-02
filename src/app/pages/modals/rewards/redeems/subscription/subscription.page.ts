import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, LoadingController } from '@ionic/angular';
import { RedeemSub } from 'src/app/models/reward';
import { Bundle } from 'src/app/models/bundle';
import { RewardsService } from 'src/app/services/rewards.service';
import { UtilService } from 'src/app/services/util.service';
import { WalletService } from 'src/app/services/wallet.service';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.page.html',
  styleUrls: ['./subscription.page.scss'],
})
export class SubscriptionPage implements OnInit {

  public redeemSub: RedeemSub;
  public chosenSub: Bundle;
  public rewardPoints: number;

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private rewardsService: RewardsService,
    private utilService: UtilService,
    private loadingCtrl: LoadingController,
    private walletService: WalletService) {

      this.redeemSub = this.navParams.get('redeemSub');
      this.rewardPoints = this.navParams.get('rewardPoints');
  }

  ngOnInit() {
  }

  public makeSubscription(){
    if(!this.chosenSub){
      this.utilService.showToast('Please select a subscription plan to redeem', 2000, 'danger');
      return;
    }

    this.utilService.presentAlertConfirm('Activate subscription', 
    `This action will cost <strong>${this.redeemSub.redeem.point}</strong> points and is irreversible. 
      <br/>Proceed with redeeming the <strong>${this.chosenSub.products_name}</strong> product?`,
      () =>{
        //

        this.utilService.presentLoading('')
          .then(() =>{
            return this.rewardsService.doRedeem(this.redeemSub.redeem.id, this.chosenSub.products_id);
          })
          .then((resp) =>{
            if(resp.code === 100){
              this.loadingCtrl.dismiss();
              this.utilService.showToast(resp.message, 3000, 'success');
              this.walletService.balanceState.next(true);
              this.rewardsService.rewardState.next(true);
              this.closeModal({closeParent:true});
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

      }, 'Cancel', 'Redeem');
  }

  public closeModal(param:any){
    this.modalCtrl.dismiss(param);
  }

}
