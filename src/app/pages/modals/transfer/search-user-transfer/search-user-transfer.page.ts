import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { UtilService } from 'src/app/services/util.service';
import { FundTransferService } from 'src/app/services/fund-transfer.service';

@Component({
  selector: 'app-search-user-transfer',
  templateUrl: './search-user-transfer.page.html',
  styleUrls: ['./search-user-transfer.page.scss'],
})
export class SearchUserTransferPage implements OnInit {

  constructor(
    private modalCtrl: ModalController,
    private utilService: UtilService,
    private loadingCtrl: LoadingController,
    private fundTransService: FundTransferService) { }

  ngOnInit() {
    
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

        this.utilService.presentLoading('Transfering funds..')
          .then(() =>{
            return this.fundTransService.doTransferFunds({username, amount});
          })
          .then((resp) =>{
            this.loadingCtrl.dismiss();
            if(resp.code === 100){
              this.utilService.showToast(`Successfully transfered \u20A6${amount} to ${username}`, 3000, 'success');
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

  public closeModal(){
    this.modalCtrl.dismiss();
  }
}
