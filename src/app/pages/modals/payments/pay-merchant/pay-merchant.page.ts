import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-pay-merchant',
  templateUrl: './pay-merchant.page.html',
  styleUrls: ['./pay-merchant.page.scss'],
})
export class PayMerchantPage implements OnInit {

  constructor(
    private modalCtrl: ModalController,
    private utility: UtilService) { }

  ngOnInit() {
  }


  public payMerchant(){
    this.utility.presentAlertConfirm('Payment Confirmation',
    'Do you want to proceed with the payment of XXXX to merchant?', ()=>{
      this.utility.showToast('Payment confirmed', 2000, 'tertiary');
      this.closeModal({closeParent: true});
    });
  }

  public closeModal(data?: any){
    data && data.closeParent? this.modalCtrl.dismiss(data): this.modalCtrl.dismiss();
  }
}
