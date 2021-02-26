import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoadingController, ModalController } from '@ionic/angular';
import { myEnterAnimation } from 'src/app/animations/enter';
import { myLeaveAnimation } from 'src/app/animations/leave';
import { Bank } from 'src/app/models/bank';
import { FundTransferService } from 'src/app/services/fund-transfer.service';
import { UtilService } from 'src/app/services/util.service';
import { BankTransferConfirmPage } from '../bank-transfer-confirm/bank-transfer-confirm.page';

@Component({
  selector: 'app-bank-transfer',
  templateUrl: './bank-transfer.page.html',
  styleUrls: ['./bank-transfer.page.scss'],
})
export class BankTransferPage implements OnInit {

  public _amount: string;
  public chosenBank: string;
  public banks: Bank[];

  constructor(
    private modalCtrl: ModalController,
    private transferService: FundTransferService,
    private utilService: UtilService,
    private loadingCtrl: LoadingController) { }

  async ngOnInit() {
    this.banks = await this.transferService.bankTransfer('banklist');
    console.log(this.banks);
  }

  public transferFunds(form: NgForm){

    if(form.invalid){
      !form.value.account ? this.utilService.showToast('Please enter an account number', 2000, 'danger'):
      this.utilService.showToast('Please enter a transfer amount', 2000, 'danger');
      return;
    }

    if(!this.chosenBank){
      this.utilService.showToast('Please select a recipient Bank', 2000, 'danger');
      return;
    }
    let amount = form.value.amount;
    amount = amount.replace(/,/g, "");

    this.utilService.presentLoading('Verify Bank Transfer')
      .then(() =>{
        return this.transferService.bankTransfer('verify', {amount, bank: form.value.bank, account: form.value.account});
      })
      .then((resp) =>{
        this.loadingCtrl.dismiss();
        if(resp.code === 100){
          this.openBankTransferConfirmModal(resp);
        }
        else if(resp.code === 418){
          this.utilService.showToast(`${resp.message}`, 3000, 'danger');
          return;
        }
      })
      .catch((error) =>{
        this.loadingCtrl.dismiss();
        console.log(error);
        this.utilService.showToast(`Bank verification failed`, 2000, 'danger');
      });

  }

  public async openBankTransferConfirmModal(transferDetails:any){
    const modal = await this.modalCtrl.create({
      component: BankTransferConfirmPage,
      enterAnimation: myEnterAnimation,
      leaveAnimation: myLeaveAnimation,
      componentProps: {'transferDetails': transferDetails}
    });
    await modal.present();

    const {data} = await modal.onDidDismiss();
    if(data){
      setTimeout(()=>{
        data.closeParent? this.closeModal({closeParent:true}): '';
      },0);
    }
  }

  public refreshModel(): void{
    this._amount = this.utilService.numberWithCommas(this._amount);
  }

  public closeModal(closeParent?:any){
    closeParent? this.modalCtrl.dismiss({closeParent}): this.modalCtrl.dismiss();
  }
}
