import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { UtilService } from 'src/app/services/util.service';
import { BundleService } from 'src/app/services/bundle.service';
import { HttpErrorResponse } from '@angular/common/http';

import { BundleTypesPage } from '../bundle-types/bundle-types.page';
import { Bundle } from 'src/app/models/bundle';

@Component({
  selector: 'app-buy-bundle',
  templateUrl: './buy-bundle.page.html',
  styleUrls: ['./buy-bundle.page.scss'],
})
export class BuyBundlePage implements OnInit {

  @ViewChild('bundleForm', null) bundleForm: NgForm;
  public bundles: {name: string, amount: string, description: { duration: string, package: string}}[];

  public chosenBundle: Bundle;

  constructor(
    private modalCtrl: ModalController, 
    private loadingCtrl: LoadingController,
    private utilService: UtilService,
    private bundleService: BundleService) { }

  ngOnInit() {
    this.bundleForm.reset();
  }

  public buyBundle(form: NgForm){
    console.log(form.value.bundle);
    if(form.invalid){
      this.utilService.showToast('Please enter valid data.', 2000, 'danger');
      return;
    }
    if(!this.chosenBundle){
      this.utilService.showToast('Please select a bundle first', 2000, 'danger');
      return;
    }
    const payload: any = {
      amount: (this.chosenBundle.amount).replace(/,/g, ''),
      pin: form.value.pin,
      bundle: this.chosenBundle.name
    };

    console.log(payload);
    this.utilService.presentLoading('Funding your wallet.')
      .then(() =>{
        console.log(payload);
        this.bundleService.buyBundle(payload)
          .then((resp) =>{
            this.loadingCtrl.dismiss();
            if(resp.code === 100){
              this.utilService.showToast(`You have sucessfully purchased the ${payload.bundle} bundle`, 3000, 'success');
              this.closeModal();
              this.bundleForm.reset();
            }
            else if(resp.code === 418){
              this.utilService.showToast(`${resp.message}`, 3000, 'danger');
            }
            else{
              this.utilService.showToast(`Your purchase could not be completed at this time`, 2000, 'danger');
            }
          })
          .catch((error: HttpErrorResponse) =>{
            if(error.status === 0){
              this.utilService.showToast('Cannot connect to server, check network...', 3000, 'danger');
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
      })
  }

  public async openBundleTypesModal(){
    const modal = await this.modalCtrl.create({
      component: BundleTypesPage,
    });
    await modal.present();
    const {data} = await modal.onDidDismiss();
    
    this.chosenBundle = data.bundle;
  }

  public closeModal(){
    this.modalCtrl.dismiss();
  }

}
