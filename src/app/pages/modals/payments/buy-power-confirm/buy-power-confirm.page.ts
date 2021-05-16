import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, LoadingController, AlertController } from '@ionic/angular';
import { ExtraServicesService } from 'src/app/services/extra-services.service';
import { UtilService } from 'src/app/services/util.service';
import { WalletService } from 'src/app/services/wallet.service';

@Component({
  selector: 'app-buy-power-confirm',
  templateUrl: './buy-power-confirm.page.html',
  styleUrls: ['./buy-power-confirm.page.scss'],
})
export class BuyPowerConfirmPage implements OnInit {

  public account:any

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private extraService: ExtraServicesService, 
    private utilService: UtilService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private walletService: WalletService){

      this.account = this.navParams.get('account');
  }

  ngOnInit() {
    //this.presentAlert('Success',`<span>Your Token:</span><br/><strong>Tokenkhbuub</strong>`);
  }

  public makePurchase(){
    this.utilService.presentAlertConfirm('Confirm Power Purchase', 
    `Kindly confirm the payment of <strong>&#8358;${this.formatNumWithCommas(this.account.total)}</strong> for power purchase.`, 
      () =>{

        let payload = {
          name: this.account.name,
          address: this.account.address,
          meter: this.account.meter,
          amount: this.account.amount,
          state: this.account.state
        }

        this.utilService.presentLoading('')
          .then(() =>{
            return this.extraService.buyElectricity(payload, 'pay');
          })       
          .then((resp) =>{
            this.loadingCtrl.dismiss();
            if(resp.code === 100){
              this.walletService.balanceState.next(true);
              this.presentAlert(resp.message,`<span>Your Token:</span><br/><strong>${resp.token}</strong>`);
            }
            else if(resp.code === 418 || resp.code === 407){
              this.utilService.showToast(resp.message, 2000, 'danger');
            }
            else{
              this.utilService.showToast(resp.message, 2000, 'danger');
            }
          })
          .catch((err) =>{
            this.loadingCtrl.dismiss();
          });

      }, 'Cancel', 'Confirm')
  }

  public formatNumWithCommas(amount){
    return this.utilService.numberWithCommas(amount);
  }

  //Customized alert to show electricity token
  public async presentAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      // subHeader: 'Subtitle',
      message,
      buttons: ['Close'],
      cssClass: 'legend-alert',
      backdropDismiss: false
    });
    await alert.present();
    alert.onDidDismiss().then(() =>{
      this.closeModal({closeParent:true})
    });
  }

  public closeModal(closeParent?:any){
    closeParent? this.modalCtrl.dismiss({closeParent}): this.modalCtrl.dismiss();
  }
}
