import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { UtilService } from 'src/app/services/util.service';
import { ExtraServicesService } from 'src/app/services/extra-services.service';
import { WalletService } from 'src/app/services/wallet.service';
import { BvnVerificationPage } from '../../transfer/bvn-verification/bvn-verification.page';
import { myEnterAnimation } from 'src/app/animations/enter';
import { myLeaveAnimation } from 'src/app/animations/leave';

@Component({
  selector: 'app-buy-airtime',
  templateUrl: './buy-airtime.page.html',
  styleUrls: ['./buy-airtime.page.scss'],
})
export class BuyAirtimePage implements OnInit {

  public chosenNetwork: any;
  public networks = ['MTN', 'GLO', 'AIRTEL', '9MOBILE'];
  public _amount: string;

  constructor(
    private modalCtrl: ModalController,
    private utilService: UtilService,
    private loadingCtrl: LoadingController,
    private buyServices: ExtraServicesService,
    private walletService: WalletService) { }

  ngOnInit() {
  }

  public buyAirtime(form: NgForm){
    let {phone, sub, amount} = form.value;

    if(form.invalid){
      return phone? this.utilService.showToast('Please enter an amount to purchase', 2000, 'danger'):
      this.utilService.showToast('Please enter a phone number', 2000, 'danger');
    }

    if(!this.chosenNetwork){
      return this.utilService.showToast('Please select a mobile network', 2000, 'danger');
    }

    phone = phone.substring(1);
    amount = amount.replace(/,/g, "");

    const payload = {phone,amount,sub};

    this.utilService.presentAlertConfirm('Confirm Airtime Purchase', 
    `Kindly confirm the purchase of <strong>&#8358;${this.formatNumWithCommas(amount)}</strong> ${sub} airtime.`,
    
      () =>{

        this.utilService.presentLoading('')
        .then(() =>{
          return this.buyServices.buyAirtime(payload);
        })
        .then((resp) =>{
          this.loadingCtrl.dismiss();
          if(resp.code === 100){
            this.walletService.balanceState.next(true);
            this.utilService.showToast(resp.message, 3000, 'success');
            this.closeModal();
          }
          else if(resp.code === 318){
            this.utilService.showToast(resp.message, 2000, 'danger');
            this.openBVNVerificationPage();
          }
          else if(resp.code === 418){
            this.utilService.showToast(resp.message, 2000, 'danger');
          }
          else{
            this.utilService.showToast(resp.message, 2000, 'danger');
          }
        })
        .catch((err) =>{
          this.loadingCtrl.dismiss();
          this.utilService.showToast(err.error.message || 'Kindly check your network connection', 3000, 'danger');
        });

      }, 'Cancel', 'Confirm');
  }

  public async openBVNVerificationPage(){
    const modal = await this.modalCtrl.create({
      component: BvnVerificationPage,
      enterAnimation: myEnterAnimation,
      leaveAnimation: myLeaveAnimation
    });
    await modal.present();
  }

  public refreshModel(): void{
    this._amount = this.utilService.numberWithCommas(this._amount);
  }

  public formatNumWithCommas(number){
    return this.utilService.numberWithCommas(number);
  }

  public closeModal(){
    this.modalCtrl.dismiss();
  }

}
