import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, AlertController } from '@ionic/angular';
import { MerchantProduct } from 'src/app/models/merchant';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.page.html',
  styleUrls: ['./all-products.page.scss'],
})
export class AllProductsPage implements OnInit {

  public products: MerchantProduct[];

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private alertCtrl: AlertController,
    private utilService: UtilService) {

      this.products = this.navParams.get('products');
  }

  ngOnInit() {
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

  public closeModal(product?: MerchantProduct){
    product? this.modalCtrl.dismiss({product}): this.modalCtrl.dismiss();
  }
}
