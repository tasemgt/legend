import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SelectMerchantPage } from '../../modals/payments/select-merchant/select-merchant.page';
import { TopUpPage } from '../../modals/topups/top-up/top-up.page';

import { myEnterAnimation } from 'src/app/animations/enter';
import { myLeaveAnimation } from 'src/app/animations/leave';




@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }


  //Modals for payment
  public async openSearchMerchantModal(){
    // this.router.navigateByUrl('/edit-profile');
    const modal = await this.modalCtrl.create({
      component: SelectMerchantPage,
      enterAnimation: myEnterAnimation,
      leaveAnimation: myLeaveAnimation
      // componentProps: {'profile': this.profile, 'user': this.user}
    });
    await modal.present();
  }

  //Modals for TopUp / Account funding
  public async openTopUpModal(){
    const modal = await this.modalCtrl.create({
      component: TopUpPage,
      enterAnimation: myEnterAnimation,
      leaveAnimation: myLeaveAnimation
    });
    await modal.present();
  }

}
