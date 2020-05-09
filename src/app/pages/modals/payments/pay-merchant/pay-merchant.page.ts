import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, LoadingController } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';
import { Merchant, MerchantProduct } from 'src/app/models/merchant';
import { Balance } from 'src/app/models/wallet';
import { NgForm } from '@angular/forms';
import { MerchantService } from 'src/app/services/merchant.service';
import { WalletService } from 'src/app/services/wallet.service';

@Component({
  selector: 'app-pay-merchant',
  templateUrl: './pay-merchant.page.html',
  styleUrls: ['./pay-merchant.page.scss'],
})
export class PayMerchantPage implements OnInit {

  public merchant: Merchant;
  public product: MerchantProduct;
  public isDirectPayment: boolean;

  public balance: Balance;

  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private navParams: NavParams,
    private merchantService: MerchantService,
    private walletService: WalletService,
    private utility: UtilService) {

      this.isDirectPayment = this.navParams.get('directPayment');
      this.product = this.navParams.get('product');
      this.merchant = this.navParams.get('merchant');
      this.balance = this.navParams.get('balance');
  }

  ngOnInit() {

    console.log(this.product);
  }


  public payMerchant(form: NgForm){

    if(!form.valid){
      this.utility.showToast('Please enter an amount to pay', 2000, 'danger');
      return;
    }

    const amount = form.value.amount;
    console.log(amount);

    this.utility.presentAlertConfirm('Payment Confirmation',
    `Do you want to proceed with the payment of 
    <strong>${amount || this.product.price}</strong> naira to <strong>${this.merchant.name}</strong>?`, 
      ()=>{

        this.utility.presentLoading('....')
          .then(() =>{
            if(this.isDirectPayment){
              return this.merchantService.directPayMerchant(this.merchant.id.toString(), amount);
            }
            else{
              return this.merchantService.buyProduct(this.product.id.toString());
            } 
          })
          .then((resp) =>{
            this.loadingCtrl.dismiss();
            if(resp.code === 100){
              this.utility.showToast(`Successfully paid to ${this.merchant.name}`, 3000, 'success');
              this.walletService.balanceState.next(true);
              return this.closeModal({closeParent: true});
            }
            else if(resp.code === 418){
              this.utility.showToast(`${resp.message}`, 3000, 'danger');
              return;
            }
            else{
              this.utility.showToast(`Payment unsuccessful`, 2000, 'danger');
              return;
            }
          })
          .catch((error) =>{
            this.loadingCtrl.dismiss();
            console.log(error);
            this.utility.showToast(`Payment unsuccessful`, 2000, 'danger');
          });
    });
  }

  public closeModal(data?: any){
    data && data.closeParent? this.modalCtrl.dismiss(data): this.modalCtrl.dismiss();
  }
}
