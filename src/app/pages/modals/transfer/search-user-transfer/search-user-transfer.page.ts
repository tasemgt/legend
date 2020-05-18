import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { UtilService } from 'src/app/services/util.service';
import { FundTransferService } from 'src/app/services/fund-transfer.service';
import { QrPagePage } from '../../utility/qr-page/qr-page.page';

@Component({
  selector: 'app-search-user-transfer',
  templateUrl: './search-user-transfer.page.html',
  styleUrls: ['./search-user-transfer.page.scss'],
})
export class SearchUserTransferPage implements OnInit {

  public username: string;
  public _amount: string;

  constructor(
    private modalCtrl: ModalController,
    private utilService: UtilService,
    private loadingCtrl: LoadingController,
    private fundTransService: FundTransferService) { }

  ngOnInit() {
    // this.username = 'tas3';
  }

  public transferFunds(form: NgForm): void{

    let username = form.value.username, amount = form.value.amount;

    if(form.invalid){
      this.utilService.showToast('Username or Amount cannot be empty', 2000, 'danger');
      return;
    }

    this.utilService.presentAlertConfirm('Fund Transfer', 
    `Kindly confirm the transfer of <strong>${amount}</strong> Naira from your Legend Pay Wallet to <strong>${username}'s</strong> wallet`, 
      () =>{
        //Do tranfer...

        amount = amount.replace(/,/g, "");

        this.utilService.presentLoading('Transfering funds..')
          .then(() =>{
            return this.fundTransService.doTransferFunds({username, amount});
          })
          .then((resp) =>{
            this.loadingCtrl.dismiss();
            if(resp.code === 100){
              this.utilService.showToast(`Successfully transfered to ${username}`, 3000, 'success');
              return this.closeModal();
            }
            else if(resp.code === 418){
              this.utilService.showToast(`${resp.message}`, 3000, 'danger');
              return;
            }
            else{
              this.utilService.showToast(`Fund transfer failed`, 2000, 'danger');
              return;
            }
          })
          .catch((error) =>{
            this.loadingCtrl.dismiss();
            console.log(error);
            this.utilService.showToast(`Fund transfer failed`, 2000, 'danger');
          });
      }, 'Cancel', 'Proceed');
    }

  public async openQRPageModal(){
    const modal = await this.modalCtrl.create({
      component: QrPagePage
    });
    await modal.present();
    const {data} = await modal.onDidDismiss();
    if(data && data.text){
      if(this.utilService.isMerchant(data.text)){
        this.utilService.showToast('QR code belongs to a Merchant. Kindly use the payments feature to pay merchants', 3500, 'danger');
        return;
      }
      else if(!this.utilService.isUser(data.text)){
        this.utilService.showToast('QR code doesn\'t belong to a legend pay user. Try again or type user name directly', 3500, 'danger');
        return;
      }

      this.username = data.text.replace(/%%-%/, '');

    }
    else if(data && data.err){
      this.utilService.showToast('QR scan failed', 2000, 'danger');
    }
  }


   // if(this._amount.startsWith('0')){
    //   console.log('called', this._amount);
    //   this._amount = '0';
    // }

  public refreshModel(): void{
    this._amount = this.utilService.numberWithCommas(this._amount);
  }

  public closeModal(){
    this.modalCtrl.dismiss();
  }
}
