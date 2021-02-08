import { Component, OnInit } from '@angular/core';
import { ModalController, Platform, NavParams, LoadingController } from '@ionic/angular';
import { SelectProductPage } from '../select-product/select-product.page';
import { myLeaveAnimation } from 'src/app/animations/leave';
import { myEnterAnimation, myEnterAnimation2 } from 'src/app/animations/enter';
import { AllMerchantsPage } from './all-merchants/all-merchants.page';
import { MerchantService } from 'src/app/services/merchant.service';
import { Merchant, MerchantWrapper } from 'src/app/models/merchant';
import { UtilService } from 'src/app/services/util.service';
import { Balance } from 'src/app/models/wallet';

import {Constants} from 'src/app/models/constants';
import { QrPagePage } from '../../utility/qr-page/qr-page.page';

@Component({
  selector: 'app-select-merchant',
  templateUrl: './select-merchant.page.html',
  styleUrls: ['./select-merchant.page.scss'],
})
export class SelectMerchantPage implements OnInit {

  public merchants: Merchant[];
  public topMerchants: Merchant[];
  public merchantWraper: any;

  public merchant: string; //Merchant ngModel
  public chosenMerchant: Merchant; //Clicked or selected merchant from merchant list modal

  public balance: Balance;

  private showIosOnce: boolean;
  public showLoading: boolean;

  public merchantImgBaseUrl = Constants.merchantImageBaseUrl;

  constructor(
    private modalCtrl: ModalController,
    private platform: Platform,
    private loadingCtrl: LoadingController,
    private navParams: NavParams,
    private merchantService: MerchantService,
    private utilService: UtilService) { 

      this.balance = this.navParams.get('balance');
    }

  ngOnInit() {
    this.showIosOnce = true;
    this.merchant = '';
    this.getMerchants();
  }



  private getMerchants(){
    this.showLoading = true;
    this.merchantService.getMerchants(false)
      .then((resp) =>{
        this.showLoading = false;
        this.merchantWraper = resp;
        this.merchants = this.merchantWraper.data;
        this.topMerchants = this.merchants.slice(0,4);
      })
      .catch((err) =>{
        if(err.status === 0){
          setTimeout(() =>{
            if(this.showIosOnce){
              this.utilService.showToast('Check network connectivity', 1000, 'danger');
              this.showIosOnce = false; 
            }
            this.getMerchants();
          }, 10000);
        }
      });
  }


  public searchMerchant(){
    if(this.merchant.length <=0 ){
      this.utilService.showToast('Search field must not be empty', 2000, 'danger');
      return;
    }
    this.openSearchMerchantsModal();
  }




  public openAllMerchantsModal(){
    this.openMerchantsModal(this.merchantWraper); //Opens the list modal from see all link passing in initial data
  }

  public openSearchMerchantsModal(){
    this.openMerchantsModal(null); //Opens the list modal from search box
  }

  // Merchant's list modal
  private async openMerchantsModal(merchantsListInitial: MerchantWrapper){
    // this.router.navigateByUrl('/edit-profile');
    const modal = await this.modalCtrl.create({
      component: AllMerchantsPage,
      enterAnimation: myEnterAnimation2,
      componentProps: {'merchant-wrapper': merchantsListInitial, 'search-word': this.merchant}
    });
    await modal.present();
    const {data} = await modal.onDidDismiss();
    if(data){
      this.chosenMerchant = data.merchant;
      
      this.openSelectProductModal(this.chosenMerchant); //Open select product with chosen merchant
    }
  }


  public async openSelectProductModal(merchant: Merchant){
    // this.router.navigateByUrl('/edit-profile');
    const modal = await this.modalCtrl.create({
      component: SelectProductPage,
      enterAnimation: myEnterAnimation,
      leaveAnimation: myLeaveAnimation,
      componentProps: {'merchant': merchant, 'balance': this.balance}
    });
    await modal.present();
  }

  public async openQRPageModal(){
    const modal = await this.modalCtrl.create({
      component: QrPagePage
    });
    await modal.present();
    const {data} = await modal.onDidDismiss();
    if(data && data.text){
      if(this.utilService.isUser(data.text)){
        this.utilService.showToast('QR code belongs to a legend pay user. Kindly use the transfer feature to transfer to a user', 3000, 'danger');
        return;
      }

      if(!this.utilService.isMerchant(data.text)){
        this.utilService.showToast('QR code doesn\'t belong to a merchant. Try again', 2000, 'danger');
        return;
      }

      let searchParam = data.text.replace(/%%%/, '');

      //Get merchant and load select product modal
      this.utilService.presentLoading('')
        .then(() =>{
          return this.merchantService.getMerchant(searchParam);
        })
        .then((merchant) =>{
          this.loadingCtrl.dismiss();
          this.openSelectProductModal(merchant);
        })
        .catch((err) =>{
          this.loadingCtrl.dismiss();
          console.log(err);
          if(err.status === '404'){
            this.utilService.showToast('Merchant not found', 2000, 'danger');
          }
        });
    }
    else if(data && data.err){
      this.utilService.showToast('QR scan failed', 2000, 'danger');
    }
  }


  public closeModal(){
    this.modalCtrl.dismiss();
  }
}
