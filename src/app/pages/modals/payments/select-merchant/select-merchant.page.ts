import { Component, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { SelectProductPage } from '../select-product/select-product.page';
import { myLeaveAnimation } from 'src/app/animations/leave';
import { myEnterAnimation, myEnterAnimation2 } from 'src/app/animations/enter';
import { AllMerchantsPage } from './all-merchants/all-merchants.page';
import { MerchantService } from 'src/app/services/merchant.service';
import { Merchant } from 'src/app/models/merchant';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-select-merchant',
  templateUrl: './select-merchant.page.html',
  styleUrls: ['./select-merchant.page.scss'],
})
export class SelectMerchantPage implements OnInit {

  public merchants: Merchant[];
  public merchantWraper: any;

  private showIosOnce: boolean;

  constructor(
    private modalCtrl: ModalController,
    private platform: Platform,
    private merchantService: MerchantService,
    private utilService: UtilService) { }

  ngOnInit() {
    this.showIosOnce = true;
    this.getMerchants();
  }



  public async getMerchants(){
    try{
      this.merchantWraper = await this.merchantService.getMerchants();
      this.merchants = this.merchantWraper.data;
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


  public async openAllMerchantsModal(){
    // this.router.navigateByUrl('/edit-profile');
    const modal = await this.modalCtrl.create({
      component: AllMerchantsPage,
      enterAnimation: myEnterAnimation2,
      componentProps: {'merchant-wrapper': this.merchantWraper}
    });
    await modal.present();
  }


  public async openSelectProductModal(){
    // this.router.navigateByUrl('/edit-profile');
    const modal = await this.modalCtrl.create({
      component: SelectProductPage,
      enterAnimation: myEnterAnimation,
      leaveAnimation: myLeaveAnimation
      // componentProps: {'profile': this.profile, 'user': this.user}
    });
    await modal.present();
  }


  public closeModal(){
    this.modalCtrl.dismiss();
  }
}
