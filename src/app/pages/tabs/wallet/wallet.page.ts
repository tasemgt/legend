import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SelectMerchantPage } from '../../modals/payments/select-merchant/select-merchant.page';



@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }


  public async openSearchMerchantModal(){
    // this.router.navigateByUrl('/edit-profile');
    const modal = await this.modalCtrl.create({
      component: SelectMerchantPage,
      // componentProps: {'profile': this.profile, 'user': this.user}
    });
    await modal.present();
  }

}
