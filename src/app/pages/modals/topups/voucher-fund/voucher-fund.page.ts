import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { UtilService } from 'src/app/services/util.service';
import { TopUpService } from 'src/app/services/top-up.service';

@Component({
  selector: 'app-voucher-fund',
  templateUrl: './voucher-fund.page.html',
  styleUrls: ['./voucher-fund.page.scss'],
})
export class VoucherFundPage implements OnInit {

  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private topUpService: TopUpService,
    private utilService: UtilService) { }

  ngOnInit() {
  }

  public fundWalletWithVoucher(form: NgForm){
    let serial = form.value.serial, pin = form.value.pin;

    if(form.invalid){
      this.utilService.showToast('Serial Number or Pin cannot be empty', 2000, 'danger');
      return;
    }

    this.utilService.presentAlertConfirm('Fund with voucher', 
    `Use voucher <strong>${serial}</strong> to top up your Legend Pay Wallet ?`, 
      () =>{
        //

        this.utilService.presentLoading('Funding with voucher..')
          .then(() =>{
            return this.topUpService.fundWithVoucher({serial, pin});
          })
          .then((resp) =>{
            this.loadingCtrl.dismiss();
            if(resp.code === 100){
              this.utilService.showToast(resp.message, 3000, 'success');
              return this.closeModal();
            }
            else if(resp.code === 418){
              this.utilService.showToast(`${resp.message}`, 3000, 'danger');
              return;
            }
            else{
              this.utilService.showToast(`Transaction failed`, 2000, 'danger');
              return;
            }
          })
          .catch((error) =>{
            this.loadingCtrl.dismiss();
            console.log(error);
            this.utilService.showToast(`Transaction failed`, 2000, 'danger');
          });
      }, 'Cancel', 'Proceed');
  }

  public closeModal(){
    this.modalCtrl.dismiss();
  }
}
