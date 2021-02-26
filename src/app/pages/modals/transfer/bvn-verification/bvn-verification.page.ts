import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoadingController, ModalController } from '@ionic/angular';
import { myEnterAnimation } from 'src/app/animations/enter';
import { myLeaveAnimation } from 'src/app/animations/leave';
import { FundTransferService } from 'src/app/services/fund-transfer.service';
import { UtilService } from 'src/app/services/util.service';
import { BankTransferPage } from '../bank-transfer/bank-transfer.page';

@Component({
  selector: 'app-bvn-verification',
  templateUrl: './bvn-verification.page.html',
  styleUrls: ['./bvn-verification.page.scss'],
})
export class BvnVerificationPage implements OnInit {

  constructor(
    private modalCtrl: ModalController,
    private utilService: UtilService,
    private transferService: FundTransferService,
    private loadingCtrl: LoadingController) { }

  ngOnInit() {
  }

  public verifyBVN(form: NgForm){
    if(!form.value.firstname){
      this.utilService.showToast('Please enter a first name', 2000, 'danger');
      return;
    }

    if(!form.value.lastname){
      this.utilService.showToast('Please enter a last name', 2000, 'danger');
      return;
    }

    if(!form.value.bvn){
      this.utilService.showToast('Please enter a bvn', 2000, 'danger');
      return;
    }

    const {firstname, middlename, lastname, bvn} = form.value;

    this.utilService.presentLoading('')
      .then(() =>{
        return this.transferService.bankTransfer('bvn', {firstname, middlename, lastname, bvn} );
      })
      .then((resp) =>{
        this.loadingCtrl.dismiss();
        if(resp.code === 100){
          this.utilService.showToast(resp.message, 2000, 'success');
          this.openBankTransferModal();
        }
        else if(resp.code === 418){
          this.utilService.showToast(resp.message, 3000, 'danger');
          return;
        }
      })
      .catch((error) =>{
        this.loadingCtrl.dismiss();
        console.log(error);
        this.utilService.showToast(`Bank verification failed`, 2000, 'danger');
      });
  }

  public async openBankTransferModal(){
    const modal = await this.modalCtrl.create({
      component: BankTransferPage,
      enterAnimation: myEnterAnimation,
      leaveAnimation: myLeaveAnimation
    });
    await modal.present();

    const {data} = await modal.onDidDismiss();
    if(data){
      setTimeout(()=>{
        data.closeParent? this.closeModal(): '';
      },0);
    }
  }

  public closeModal(){
    this.modalCtrl.dismiss();
  }

}
