import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { PaymentMethod } from 'src/app/models/payment';
import { FundWalletPage } from '../../modals/fund-wallet/fund-wallet.page';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-payment',
  templateUrl: 'payment.page.html',
  styleUrls: ['payment.page.scss']
})
export class PaymentPage implements OnInit {

  public user: User;
  public paymentType: string;


  public paymentMethods: PaymentMethod[] = [
    { name: 'LegendPay', isActive: true, value: 1}
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
    for(const paymentMethod of this.paymentMethods){
      if(paymentMethod.value !== _paymentMethod.value){
        paymentMethod.isActive = false;
      }
    }
  }

}
