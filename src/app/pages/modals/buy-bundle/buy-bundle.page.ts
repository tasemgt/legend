import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { UtilService } from 'src/app/services/util.service';
import { BundleService } from 'src/app/services/bundle.service';
import { HttpErrorResponse } from '@angular/common/http';

import { BundleTypesPage } from '../bundle-types/bundle-types.page';
import { Bundle } from 'src/app/models/bundle';
import { WalletService } from 'src/app/services/wallet.service';


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

  constructor(
    private modalCtrl: ModalController, 
    private loadingCtrl: LoadingController,
    private utilService: UtilService,
    private bundleService: BundleService,
    private walletService: WalletService) { 

    }

  ngOnInit() {
    this.bundleForm.reset();
  }

  public buyBundle(form: NgForm){
    if(!this.chosenBundle){
      this.utilService.showToast('Please select a bundle first', 2000, 'danger');
      return;
    }
    console.log(this.chosenBundle);

    if(this.renewOrRequest === '0'){
      // send a request for subscription..
      this.utilService.presentAlertConfirm('Send Subscription Request', `To activate plan, a request has to be made. <br/> Proceed?`, 
      () =>{
        this.utilService.presentLoading('')
          .then(() =>{
            // Make the request here...
            return this.bundleService.buyBundle(Number(this.renewOrRequest), this.chosenBundle.products_id);
          })
          .then((resp) =>{
            this.loadingCtrl.dismiss();
            if(resp.code === 100){
              this.utilService.showToast(`A subscription request has been made, and a confirmation email sent to you`, 3000, 'success');
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

    if(this.renewOrRequest === '1'){
      //Proceed to subscribe...

      this.utilService.presentAlertConfirm('Confirm Subscription', `Are you sure you want to proceed to subscribe this plan?`, 
    
      () =>{

        this.utilService.presentLoading('Funding your wallet.')
        .then(() =>{
          this.bundleService.buyBundle(Number(this.renewOrRequest), this.chosenBundle.products_id)
            .then((resp) =>{
              this.loadingCtrl.dismiss();
              if(resp.code === 100){
                this.walletService.getBalance()
                .then((balance) =>{
                  this.utilService.showToast(`Your payment of ${this.chosenBundle.checkout_amount} to your Legend subscription was successful`, 3000, 'success');
                  this.closeModal(balance);
                  this.bundleForm.reset();
                });
              }
              else if(resp.code === 418){
                this.utilService.showToast(`${resp.message}`, 3000, 'danger');
                this.closeModal();
                this.bundleForm.reset();
              }
              else{
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
    const modal = await this.modalCtrl.create({
      component: BundleTypesPage,
    });
    await modal.present();
    const {data} = await modal.onDidDismiss();
    if(data){
      this.chosenBundle = data.bundle;
      this.renewOrRequest = data.renew;
      console.log(this.chosenBundle, data.renew);
    }
  }

  public closeModal(balance?: any){
    balance? this.modalCtrl.dismiss({balance}): this.modalCtrl.dismiss();
  }

}
