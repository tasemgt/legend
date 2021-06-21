import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoadingController, ModalController, NavParams } from '@ionic/angular';
import { FundTransferService } from 'src/app/services/fund-transfer.service';
import { UtilService } from 'src/app/services/util.service';
import { WalletService } from 'src/app/services/wallet.service';

@Component({
  selector: 'app-bank-transfer-confirm',
  templateUrl: './bank-transfer-confirm.page.html',
  styleUrls: ['./bank-transfer-confirm.page.scss'],
})
export class BankTransferConfirmPage implements OnInit {

  public transferDetails: any;

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private transferService: FundTransferService,
    private utilService: UtilService,
    private walletService: WalletService,
    private loadingCtrl: LoadingController) { 
    this.transferDetails = this.navParams.get('transferDetails');
  }

  ngOnInit() {
  }

  public makeTransfer(form: NgForm){

    if(!form.valid){
      this.utilService.showToast('Transfer pin is required', 2000, 'danger');
      return;
    }

    console.log(form.value.pin)
    
    const reg = /^\d+$/;
    if(!(reg.test(form.value.pin))){
      this.utilService.showToast('Transfer pin contains invalid characters', 2000, 'danger');
      return;
    }

    this.utilService.presentAlertConfirm('Confirm Bank Transfer', 
    `Kindly confirm the transfer of <strong>&#8358;${this.formatNumWithCommas(this.transferDetails.amount)}</strong> from your LegendPay wallet to.
    \n${this.transferDetails.bank_name} <strong>(${this.transferDetails.account_number})</strong>`, 
      () =>{

        let payload = {
          accountno: this.transferDetails.account_number,
          accountname: this.transferDetails.account_name,
          bank: this.transferDetails.bank_name,
          bankcode: this.transferDetails.bank_code,
          ref: this.transferDetails.ref,
          amount: this.transferDetails.amount,
          pin: form.value.pin
        }

        this.utilService.presentLoading('')
          .then(() =>{
            return this.transferService.bankTransfer('transfer', payload);
          })       
          .then((resp) =>{
            this.loadingCtrl.dismiss();
            if(resp.code === 100){
              this.walletService.balanceState.next(true);
              this.utilService.showToast(resp.message, 3000, 'success');
              this.closeModal({closeParent: true});
            }
            else if(resp.code === 418 || resp.code === 407){
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

  public closeModal(closeParent?:any){
    closeParent? this.modalCtrl.dismiss({closeParent}): this.modalCtrl.dismiss();
  }
}
