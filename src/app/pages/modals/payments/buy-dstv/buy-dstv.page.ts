import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { ExtraServicesService } from 'src/app/services/extra-services.service';
import { UtilService } from 'src/app/services/util.service';
import { NgForm } from '@angular/forms';
import { BuyDstvConfirmPage } from '../buy-dstv-confirm/buy-dstv-confirm.page';
import { myEnterAnimation } from 'src/app/animations/enter';

@Component({
  selector: 'app-buy-dstv',
  templateUrl: './buy-dstv.page.html',
  styleUrls: ['./buy-dstv.page.scss'],
})
export class BuyDstvPage implements OnInit {

  public subscriptions: any;
  public chosenSub: string;

  constructor(
    private modalCtrl: ModalController,
    private buyServices: ExtraServicesService,
    private utilService: UtilService,
    private loadingCtrl: LoadingController) { }

  async ngOnInit() {
    try {
      this.subscriptions = await this.buyServices.buyDstvSubscription('fetch'); 
    } catch (err) {
      
    }
  }

  public verifyAccountDetails(form: NgForm){
    const {smartcard, sub} = form.value;
    if(form.invalid){
        return this.utilService.showToast('Please enter a Smartcard Number', 2000, 'danger');
    }

    if(!this.chosenSub){
      return this.utilService.showToast('Please select a DSTV Subscription', 2000, 'danger');
    }

    this.utilService.presentLoading('')
      .then(() =>{
        return this.buyServices.buyDstvSubscription('verify', {smartcard, sub:sub.id.toString()});
      })
      .then((resp) =>{
        this.loadingCtrl.dismiss();
        if(resp.code === 100){
          this.openDstvConfirmPage(resp);
        }
        else if(resp.code === 418){
          this.utilService.showToast(resp.message, 2000, 'danger');
        }
      })
      .catch((err) =>{
        this.loadingCtrl.dismiss();
        this.utilService.showToast(err.error.message || 'Kindly check your network connection', 2000, 'danger');
      });
  }

  public async openDstvConfirmPage(dstvAccount: any){
    const modal = await this.modalCtrl.create({
      component: BuyDstvConfirmPage,
      enterAnimation: myEnterAnimation,
      leaveAnimation: myEnterAnimation,
      componentProps: {'account': dstvAccount}
    });
    await modal.present();

    const {data} = await modal.onDidDismiss();
    if(data){
      setTimeout(()=>{
        data.closeParent? this.closeModal(): '';
      },0);
    }
  }

  public formatWithCommas(number){
    return this.utilService.numberWithCommas(number);
  }

  public closeModal(){
    this.modalCtrl.dismiss();
  }
}
