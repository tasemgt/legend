import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';


import { BuyBundlePage } from '../buy-bundle/buy-bundle.page';

import { Balance } from 'src/app/models/wallet';
import { RenewBundlePage } from '../renew-bundle/renew-bundle.page';
import { AuthService } from 'src/app/services/auth.service';
import { myEnterAnimation } from 'src/app/animations/enter';
import { myLeaveAnimation } from 'src/app/animations/leave';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-bundle-details',
  templateUrl: './bundle-details.page.html',
  styleUrls: ['./bundle-details.page.scss'],
})
export class BundleDetailsPage implements OnInit {

  public currentBundle: Balance;

  constructor(
    private navParams: NavParams, 
    private modalCtrl: ModalController, 
    private auth: AuthService,
    private utilService: UtilService) {
    this.currentBundle = this.navParams.get('balance');
   }

  ngOnInit() {
  }

  public async openRenewBundleModal(){
    const modal = await this.modalCtrl.create({
      component: RenewBundlePage,
      enterAnimation: myEnterAnimation,
      leaveAnimation: myLeaveAnimation,
      componentProps: {'bundle': this.currentBundle, 'profile': this.navParams.get('profile')}
    });
    await modal.present();
    const {data} = await modal.onDidDismiss();
    if(data){
      this.currentBundle = data.balance;
    }
  }


  public async openBuyBundleModal(){
    const modal = await this.modalCtrl.create({
      component: BuyBundlePage,
      enterAnimation: myEnterAnimation,
      leaveAnimation: myLeaveAnimation
    });
    await modal.present();
    const {data} = await modal.onDidDismiss();
    if(data){
      this.currentBundle = data.balance;
    }
  }

  public formatWithCommas(num: any){
    return this.utilService.numberWithCommas(num);
  }


  public closeModal(){
    this.modalCtrl.dismiss();
  }

}
