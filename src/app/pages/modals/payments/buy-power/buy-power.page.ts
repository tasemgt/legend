import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, IonSlides, LoadingController } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';
import { myEnterAnimation } from 'src/app/animations/enter';
import { myLeaveAnimation } from 'src/app/animations/leave';
import { BuyPowerConfirmPage } from '../buy-power-confirm/buy-power-confirm.page';
import { NgForm } from '@angular/forms';
import { ExtraServicesService } from 'src/app/services/extra-services.service';
import { BvnVerificationPage } from '../../transfer/bvn-verification/bvn-verification.page';

@Component({
  selector: 'app-buy-power',
  templateUrl: './buy-power.page.html',
  styleUrls: ['./buy-power.page.scss'],
})
export class BuyPowerPage implements OnInit {


  public _amount: string;
  public chosenState: string;

  public states = [
    'Abuja'
  ]

  constructor(
    private modalCtrl: ModalController,
    private utilService: UtilService,
    private loadingCtrl: LoadingController,
    private extraService: ExtraServicesService) { }

  ngOnInit() {
  }


  public fetchAccountDetails(form: NgForm){

    let meter = form.value.meter, amount = form.value.amount, state = form.value.state;

    if(form.invalid){
      this.utilService.showToast('Meter number, Amount or State cannot be empty', 2000, 'danger');
      return;
    }

    if(!this.chosenState){
      return this.utilService.showToast('Kindly select a state to proceed', 2000, 'danger');
    }

    amount = amount.replace(/,/g, "");

    this.utilService.presentLoading('')
      .then(() =>{
        return this.extraService.buyElectricity({meter,  amount:Number(amount), state}, 'fetch');
      })
      .then((resp) =>{
        this.loadingCtrl.dismiss();
        if(resp.code === 100){
          this.openBuyPowerModal(resp);
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
        this.utilService.showToast(err.error.message || 'Kindly check your network connection', 2000, 'danger');
      });
  }

  public refreshModel(): void{
    this._amount = this.utilService.numberWithCommas(this._amount);
  }

  public async openBuyPowerModal(account:any){
    const modal = await this.modalCtrl.create({
      component: BuyPowerConfirmPage,
      enterAnimation: myEnterAnimation,
      leaveAnimation: myLeaveAnimation,
      componentProps: {'account': account}
    });
    await modal.present();

    const {data} = await modal.onDidDismiss();
    if(data){
      setTimeout(()=>{
        data.closeParent? this.closeModal(): '';
      },0);
    }
  }

  public async openBVNVerificationPage(){
    const modal = await this.modalCtrl.create({
      component: BvnVerificationPage,
      enterAnimation: myEnterAnimation,
      leaveAnimation: myLeaveAnimation
    });
    await modal.present();
  }

  public closeModal(){
    this.modalCtrl.dismiss();
  }
}
