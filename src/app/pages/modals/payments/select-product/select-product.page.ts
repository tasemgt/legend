import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PayMerchantPage } from '../pay-merchant/pay-merchant.page';
import { myEnterAnimation } from 'src/app/animations/enter';
import { myLeaveAnimation } from 'src/app/animations/leave';

@Component({
  selector: 'app-select-product',
  templateUrl: './select-product.page.html',
  styleUrls: ['./select-product.page.scss'],
})
export class SelectProductPage implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  public async openPayMerchantModal(){
    // this.router.navigateByUrl('/edit-profile');
    const modal = await this.modalCtrl.create({
      component: PayMerchantPage,
      enterAnimation: myEnterAnimation,
      leaveAnimation: myLeaveAnimation
    });
    await modal.present();

    const {data} = await modal.onDidDismiss();
    if(data){
      console.log("Reached here..");
      setTimeout(()=>{
        data.closeParent? this.closeModal(): '';
      },0);
    }
  }

  public closeModal(){
    this.modalCtrl.dismiss();
  }

}
