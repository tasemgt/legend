import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, LoadingController } from '@ionic/angular';
import { RedeemMerchant } from 'src/app/models/reward';
import { UtilService } from 'src/app/services/util.service';
import { RewardsService } from 'src/app/services/rewards.service';
import { WalletService } from 'src/app/services/wallet.service';

@Component({
  selector: 'app-merchant',
  templateUrl: './merchant.page.html',
  styleUrls: ['./merchant.page.scss'],
})
export class MerchantPage implements OnInit {

  public redeemMerchant: RedeemMerchant;
  public rewardPoints: number;
  public payAmount: string;
  

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private utilService: UtilService,
    private loadingCtrl: LoadingController,
    private rewardsService: RewardsService,
    private walletService: WalletService) { 

      this.redeemMerchant = this.navParams.get('redeemMerchant');
      this.rewardPoints = this.navParams.get('rewardPoints');
  }

  ngOnInit() {
  }

  public makePayment(){
    this.utilService.presentAlertConfirm('Pay for Discounted Product', 
    `This action will cost <strong>${this.redeemMerchant.redeem.point}</strong> points and is irreversible. 
      <br/>Proceed with payment of <strong>${this.payAmount}</strong> for <strong>${this.redeemMerchant.product.name}</strong> ?`,
      () =>{
        //

        this.utilService.presentLoading('')
          .then(() =>{
            return this.rewardsService.doRedeem(this.redeemMerchant.redeem.id);
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


  public formatWithCommas(num: any){
    if(!num){
      return;
    }
    return this.utilService.numberWithCommas(num);
  }

  public getDiscount(price:any, discount:any){

    price = Number(price);
    discount = Number(discount);

    if(this.redeemMerchant.redeem.charge_type.toLowerCase() === 'singlefixed'){
      return this.payAmount =  this.formatWithCommas(price - discount);
    }
    else if(this.redeemMerchant.redeem.charge_type.toLowerCase() === 'singlepercentage'){
      const discountAmount = discount / 100 * price;
      return this.payAmount =  this.formatWithCommas(price - discountAmount);
    }
  }

  public closeModal(param:any){
    this.modalCtrl.dismiss(param);
  }

}
