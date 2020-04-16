import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SelectProductPage } from '../select-product/select-product.page';

@Component({
  selector: 'app-select-merchant',
  templateUrl: './select-merchant.page.html',
  styleUrls: ['./select-merchant.page.scss'],
})
export class SelectMerchantPage implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }


  public async openSelectProductModal(){
    // this.router.navigateByUrl('/edit-profile');
    const modal = await this.modalCtrl.create({
      component: SelectProductPage,
      // componentProps: {'profile': this.profile, 'user': this.user}
    });
    await modal.present();
  }


  public closeModal(){
    this.modalCtrl.dismiss();
  }
}
