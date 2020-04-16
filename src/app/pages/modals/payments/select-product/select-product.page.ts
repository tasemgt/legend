import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-select-product',
  templateUrl: './select-product.page.html',
  styleUrls: ['./select-product.page.scss'],
})
export class SelectProductPage implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  public payMerchant(){
    
  }

  public closeModal(){
    this.modalCtrl.dismiss();
  }

}
