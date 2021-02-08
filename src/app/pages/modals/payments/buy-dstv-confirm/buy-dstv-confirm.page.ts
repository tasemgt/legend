import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, LoadingController } from '@ionic/angular';
import { ExtraServicesService } from 'src/app/services/extra-services.service';
import { UtilService } from 'src/app/services/util.service';
import { WalletService } from 'src/app/services/wallet.service';

@Component({
  selector: 'app-buy-dstv-confirm',
  templateUrl: './buy-dstv-confirm.page.html',
  styleUrls: ['./buy-dstv-confirm.page.scss'],
})
export class BuyDstvConfirmPage implements OnInit {

  public account: any;

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private extraService: ExtraServicesService, 
    private utilService: UtilService,
    private loadingCtrl: LoadingController,
    private walletService: WalletService) {

      this.account = this.navParams.get('account');
    }

  ngOnInit() {
  }

  public formatNumWithCommas(number){
    return this.utilService.numberWithCommas(number);
  }

  public makePurchase(){
    this.utilService.presentAlertConfirm('Confirm DSTV Subscription', 
    `Kindly confirm the payment of <strong>&#8358;${this.formatNumWithCommas(this.account.total)}</strong> for ${this.account.product} subscription.`, 
      () =>{

        let payload = {
          smartcard: this.account.smartno,
          sub: this.account.product,
          amount: this.account.amount
        }

        this.utilService.presentLoading('')
          .then(() =>{
            return this.extraService.buyDstvSubscription('subscribe', payload);
          })       
          .then((resp) =>{
            this.loadingCtrl.dismiss();
            if(resp.code === 100){
              this.walletService.balanceState.next(true);
              this.utilService.showToast(resp.message, 3000, 'success');
              this.closeModal({closeParent:true}); //close parent modal as well
            }
            else if(resp.code === 418 || resp.code === 407){
              this.utilService.showToast(resp.message, 3000, 'danger');
            }
          })
          .catch((err) =>{
            this.loadingCtrl.dismiss();
            this.utilService.showToast(err.error.message || 'Kindly check your network connection', 3000, 'danger');
          });

      }, 'Cancel', 'Confirm')
  }

  public closeModal(closeParent?:any){
    closeParent? this.modalCtrl.dismiss({closeParent}): this.modalCtrl.dismiss();
  }
}
