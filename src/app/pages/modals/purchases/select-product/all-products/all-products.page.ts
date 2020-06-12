import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
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

  public closeModal(product?: MerchantProduct){
    product? this.modalCtrl.dismiss({product}): this.modalCtrl.dismiss();
  }
}
