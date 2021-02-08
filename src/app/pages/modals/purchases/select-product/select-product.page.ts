import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, Platform, AlertController } from '@ionic/angular';
import { PayMerchantPage } from '../pay-merchant/pay-merchant.page';
import { myEnterAnimation, myEnterAnimation2 } from 'src/app/animations/enter';
import { myLeaveAnimation } from 'src/app/animations/leave';
import { Merchant, MerchantProduct } from 'src/app/models/merchant';
import { MerchantService } from 'src/app/services/merchant.service';
import { UtilService } from 'src/app/services/util.service';
import { AllProductsPage } from './all-products/all-products.page';
import { Balance } from 'src/app/models/wallet';
import { Constants } from 'src/app/models/constants';

@Component({
  selector: 'app-select-product',
  templateUrl: './select-product.page.html',
  styleUrls: ['./select-product.page.scss'],
})
export class SelectProductPage implements OnInit {

  public merchant: Merchant;
  public products: MerchantProduct[];

  public balance: Balance;

  public chosenProduct: MerchantProduct;
  public showLoading: boolean;

  public showIosOnce = true;

  public merchantImgBaseUrl = Constants.merchantImageBaseUrl;

  constructor(
    private platform: Platform,
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private merchantService: MerchantService,
    private utilService: UtilService,
    private alertCtrl: AlertController) { 
    
      this.merchant = this.navParams.get('merchant');
      this.balance = this.navParams.get('balance');
  }

  ngOnInit() {
    this.getMerchantProducts();
  }

  public async openPayMerchantModal(directPayment:boolean, product?: MerchantProduct){
    const modal = await this.modalCtrl.create({
      component: PayMerchantPage,
      enterAnimation: myEnterAnimation,
      leaveAnimation: myLeaveAnimation,
      componentProps: {
        'merchant':this.merchant, 
        'directPayment':directPayment, 
        'product':product
      }
    });
    await modal.present();

    const {data} = await modal.onDidDismiss();
    if(data){
      setTimeout(()=>{
        data.closeParent? this.closeModal(): '';
      },0);
    }
  }

  public async openAllProductsModal(){
    const modal = await this.modalCtrl.create({
      component: AllProductsPage,
      enterAnimation: myEnterAnimation2,
      componentProps: {'products':this.products}
    });
    await modal.present();

    const {data} = await modal.onDidDismiss();
    if(data){
     this.chosenProduct = data.product;

     this.openPayMerchantModal(false, this.chosenProduct);
    }
  }

  public getMerchantProducts(): void{
    this.showLoading = true;
    this.merchantService.getProducts(this.merchant.id)
      .then((products) =>{
        this.products = [...products]; //Not necessary, just for clean code;
        this.showLoading = false;
      })
      .catch((err) =>{
        if(err.status === 0){
          setTimeout(() =>{
            if(this.platform.is('android') || (this.platform.is('ios') && this.showIosOnce)){
              this.utilService.showToast('Check network connectivity', 1000, 'danger');
              this.showIosOnce = false; 
            }
            this.getMerchantProducts();
          }, 15000);
        }
      })
  }

  public formatWithCommas(num: any){
    if(!num){
      return;
    }
    return this.utilService.numberWithCommas(num);
  }


  public async presentAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      // subHeader: 'Subtitle',
      message,
      buttons: ['Close'],
      cssClass: 'legend-alert info-display',
      backdropDismiss: false
    });
    await alert.present();
  }
  

  public closeModal(){
    this.modalCtrl.dismiss();
  }

}
