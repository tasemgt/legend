import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PayMerchantPage } from '../pay-merchant/pay-merchant.page';

@Component({
  selector: 'app-select-merchant',
  templateUrl: './select-merchant.page.html',
  styleUrls: ['./select-merchant.page.scss'],
})
export class SelectMerchantPage implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }


  public async openPayMerchantModal(){
    // this.router.navigateByUrl('/edit-profile');
    const modal = await this.modalCtrl.create({
      component: PayMerchantPage,
      // componentProps: {'profile': this.profile, 'user': this.user}
    });
    await modal.present();
  }


  public closeModal(){
    this.modalCtrl.dismiss();
  }
}
