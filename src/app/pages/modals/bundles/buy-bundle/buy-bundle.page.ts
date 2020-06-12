import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, LoadingController, NavParams } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { UtilService } from 'src/app/services/util.service';
import { BundleService } from 'src/app/services/bundle.service';
import { HttpErrorResponse } from '@angular/common/http';

import { BundleTypesPage } from '../bundle-types/bundle-types.page';
import { Bundle } from 'src/app/models/bundle';
import { WalletService } from 'src/app/services/wallet.service';
import { AuthService } from 'src/app/services/auth.service';
import { Plans } from 'src/app/models/constants';


@Component({
  selector: 'app-buy-bundle',
  templateUrl: './buy-bundle.page.html',
  styleUrls: ['./buy-bundle.page.scss'],
})
export class BuyBundlePage implements OnInit {

  @ViewChild('bundleForm', null) bundleForm: NgForm;
  public bundles: {name: string, amount: string, description: { duration: string, package: string}}[];
  public chosenBundle: Bundle;
  public renewOrRequest: string;

  public toggle: boolean;
  public disableToggle: boolean;

  public plans = Plans;

  public chosenPlan: any;

  constructor(
    private modalCtrl: ModalController, 
    private loadingCtrl: LoadingController,
    private auth: AuthService,
    private utilService: UtilService,
    private bundleService: BundleService,
    private navParams: NavParams,
    private walletService: WalletService) { 

      this.disableToggle = true;
      this.toggle = false;
  }

  ngOnInit() {
    this.bundleForm.reset();
  }

  public buyBundle(){
    if(!this.chosenBundle){
      this.utilService.showToast('Please select a bundle first', 2000, 'danger');
      return;
    }

    if(this.toggle && !this.chosenPlan){
      this.utilService.showToast('To use auto renew, you must select a renewal plan', 3000, 'danger');
      return;
    }

    console.log(this.chosenBundle);

    let rate;

    this.toggle ? rate = this.chosenPlan.value : rate = 0;

    let payload = {
      activeid: Number(this.renewOrRequest),
      pid: this.chosenBundle.products_id,
      autorenew: Number(this.toggle),
      autorenew_rate: rate
    }

    console.log(payload);

    if(this.renewOrRequest === '0'){
      // send a request for subscription..
      this.utilService.presentAlertConfirm('Request Plan Change',
     `You are requesting a change in subscription plan to <br><strong>(${this.chosenBundle.products_name})</strong>. <br><br> Proceed?`,
      () =>{
        this.utilService.presentLoading('')
          .then(() =>{
            // Make the request here...
            return this.bundleService.buyBundle(payload);
          })
          .then((resp) =>{
            this.loadingCtrl.dismiss();
            if(resp.code === 100){
              this.utilService.showToast(`A subscription request has been made, and a confirmation email sent to you`, 4000, 'success');
              this.closeModal();
            }
            else if(resp.code === 418){
              this.utilService.showToast(`${resp.message}`, 3000, 'danger');
            }
            else{
              this.utilService.showToast(`Your purchase could not be completed at this time`, 2000, 'danger');
            }
          })

      });
    }


    let message: string;

    this.toggle ? message = `Confirm this subscription plan with ${this.chosenPlan.verb} <strong>${this.chosenPlan.name}</strong> renewal?`:
                            message = `Proceed with confirming the subscription of this plan?`;

    if(this.renewOrRequest === '1'){
      //Proceed to subscribe...

      console.log(payload);
      this.utilService.presentAlertConfirm('Confirm Subscription', message, 
    
      () =>{

        this.utilService.presentLoading('Funding your wallet.')
        .then(() =>{
          this.bundleService.buyBundle(payload)
            .then((resp) =>{
              if(resp.code === 100){
                this.walletService.getBalance()
                .then((balance) =>{
                  this.loadingCtrl.dismiss();
                  this.utilService.showToast(resp.message, 4000, 'success');
                  // this.utilService.showToast(`Your subscription to the ${this.chosenBundle.products_name} plan was successful`, 4000, 'success');
                  this.closeModal(balance);
                  this.bundleForm.reset();
                });
              }
              else if(resp.code === 418){
                this.loadingCtrl.dismiss();
                this.utilService.showToast(`${resp.message}`, 3000, 'danger');
                this.closeModal();
                this.bundleForm.reset();
              }
              else{
                this.loadingCtrl.dismiss();
                this.utilService.showToast(`Your purchase could not be completed at this time`, 2000, 'danger');
              }
            })
            .catch((error: HttpErrorResponse) =>{
              if(error.status === 0){
                this.utilService.showToast('Cannot connect to server at the moment, please try again later', 3000, 'danger');
                setTimeout(()=>{
                  this.loadingCtrl.dismiss();
                },2000);
              }
              else{
                this.utilService.showToast(`Transaction not successful.`, 2000, 'danger');
                this.bundleForm.resetForm();
                setTimeout(()=>{
                  this.loadingCtrl.dismiss();
                },2000);
              } 
            });
        });

      });
    }
  }

  public async openBundleTypesModal(){

    this.disableToggle = true;
    this.toggle = false;

    const modal = await this.modalCtrl.create({
      component: BundleTypesPage,
    });
    await modal.present();
    const {data} = await modal.onDidDismiss();
    if(data){
      this.chosenBundle = data.bundle;
      this.renewOrRequest = data.renew;

      if(this.chosenBundle.checkout_cycle === 'month'){
        this.disableToggle = false;
      }
      console.log(this.chosenBundle, data.renew);
    }
  }


  public onToggle(): void{
    // if(this.toggle){
    //   this.chosenPlan ? this.calculateAmount(): '';
    // }
    // else{
    //   this._amount = this.formatNumWithCommas(this.currentBundle.price);
    // }
  }

  public onTapToggle(){
    if(this.disableToggle){
      this.utilService.showToast('Kindly select a monthly bundle to use this feature', 3000, 'danger');
    }
  }

  public closeModal(balance?: any){
    balance? this.modalCtrl.dismiss({balance}): this.modalCtrl.dismiss();
  }

}
