import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-pay-merchant',
  templateUrl: './pay-merchant.page.html',
  styleUrls: ['./pay-merchant.page.scss'],
})
export class PayMerchantPage implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }


  public payMerchant(){
    
  }

  public closeModal(){
    this.modalCtrl.dismiss();
  }
}
