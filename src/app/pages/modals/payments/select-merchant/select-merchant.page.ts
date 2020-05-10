import { Component, OnInit } from '@angular/core';
import { ModalController, Platform, NavParams } from '@ionic/angular';
import { SelectProductPage } from '../select-product/select-product.page';
import { myLeaveAnimation } from 'src/app/animations/leave';
import { myEnterAnimation, myEnterAnimation2 } from 'src/app/animations/enter';
import { AllMerchantsPage } from './all-merchants/all-merchants.page';
import { MerchantService } from 'src/app/services/merchant.service';
import { Merchant, MerchantWrapper } from 'src/app/models/merchant';
import { UtilService } from 'src/app/services/util.service';
import { Balance } from 'src/app/models/wallet';

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

  constructor(
    private modalCtrl: ModalController,
    private platform: Platform,
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



  private async getMerchants(){
    try{
      this.merchantWraper = await this.merchantService.getMerchants(false);
      this.merchants = this.merchantWraper.data;
      this.topMerchants = this.merchants.slice(0,4);
      console.log(this.topMerchants);
    }
    catch(err){
      if(err.status === 0){
        console.log("calling again")
        setTimeout(() =>{
          if(this.platform.is('android') || (this.platform.is('ios') && this.showIosOnce)){
            this.utilService.showToast('Check network connectivity', 1000, 'danger');
            this.showIosOnce = false; 
          }
          this.getMerchants();
        }, 15000);
      }
    }
  }


  public searchMerchant(){
    if(this.merchant.length <=0 ){
      this.utilService.showToast('Search field must not be empty', 2000, 'danger');
      return;
    }
    console.log(this.merchant.length);
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


  public closeModal(){
    this.modalCtrl.dismiss();
  }
}
