import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { PaymentMethod } from 'src/app/models/payment';
import { FundWalletPage } from '../fund-wallet/fund-wallet.page';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { myEnterAnimation } from 'src/app/animations/enter';
import { myLeaveAnimation } from 'src/app/animations/leave';


@Component({
  selector: 'app-top-up',
  templateUrl: 'top-up.page.html',
  styleUrls: ['top-up.page.scss']
})
export class TopUpPage implements OnInit {

  public user: User;
  public paymentType: string;


  public paymentMethods: PaymentMethod[] = [
    { name: 'Voucher', isActive: true, value: 1},
    { name: 'LegendPay', isActive: false, value: 2}
    // { name: 'Paystack', isActive: false, value: 2},
    // { name: 'NetPlus', isActive: false, value: 3}
  ];

  constructor(
    private modalCtrl: ModalController,
    private authService: AuthService) {

      this.paymentType = this.paymentMethods[0].name.toLowerCase(); // Initialize with first item on list
    }


  ngOnInit(){
    this.authService.getUser().then((user) =>{
      this.user = user;
    });
  }



  public async openFundWalletModal(){
    const modal = await this.modalCtrl.create({
      component: FundWalletPage,
      enterAnimation: myEnterAnimation,
      leaveAnimation: myLeaveAnimation,
      componentProps: {
        'email': this.user.email,
        'paymentType': this.paymentType
      }
    });
    return await modal.present();
  }


  public onClickItem(_paymentMethod : PaymentMethod){
    _paymentMethod.isActive = true;
    this.paymentType = _paymentMethod.name;
    console.log(this.paymentType);
    for(const paymentMethod of this.paymentMethods){
      if(paymentMethod.value !== _paymentMethod.value){
        paymentMethod.isActive = false;
      }
    }
  }

  public closeModal(){
    this.modalCtrl.dismiss();
  }
}
