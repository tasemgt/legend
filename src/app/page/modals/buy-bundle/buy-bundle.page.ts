import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { UtilService } from 'src/app/services/util.service';
import { BundleService } from 'src/app/services/bundle.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-buy-bundle',
  templateUrl: './buy-bundle.page.html',
  styleUrls: ['./buy-bundle.page.scss'],
})
export class BuyBundlePage implements OnInit {

  @ViewChild('bundleForm', null) bundleForm: NgForm;

  constructor(
    private modalCtrl: ModalController, 
    private loadingCtrl: LoadingController,
    private utilService: UtilService,
    private bundleService: BundleService) { }

  ngOnInit() {
    this.bundleForm.reset();
  }

  public buyBundle(form: NgForm){
    if(form.invalid){
      this.utilService.showToast('Please enter valid data.', 2000, 'danger');
      return;
    }
    let payload: any = {
      amount: form.value.amount,
      pin: form.value.pin,
      bundle: 'Sweet Bundle'
    };

    this.utilService.presentLoading('Funding your wallet.')
      .then(() =>{
        console.log(payload);
        this.bundleService.buyBundle(payload)
          .then((resp) =>{
            this.loadingCtrl.dismiss();
            if(resp.code === 100){
              this.utilService.showToast(`You have sucessfully purchased \u20A6${payload.amount} worth of bundle`, 3000, 'success');
            }
            else{
              this.utilService.showToast(`Your purchase could not be completed at this time`, 2000, 'danger');
            }
            this.closeModal();
            this.bundleForm.reset();
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

  public closeModal(){
    this.modalCtrl.dismiss();
  }

}
