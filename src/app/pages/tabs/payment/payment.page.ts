import { Component } from '@angular/core';
import { PaymentMethod } from 'src/app/models/payment';

@Component({
  selector: 'app-payment',
  templateUrl: 'payment.page.html',
  styleUrls: ['payment.page.scss']
})
export class PaymentPage {

  public paymentMethods: PaymentMethod[] = [
    { name: 'Voucher', isActive: true, value: 1},
    { name: 'Debit Card', isActive: false, value: 2},
    { name: 'Micro Payment', isActive: false, value: 3}
  ];

  constructor() {}

  public onClickItem(_paymentMethod : PaymentMethod){
    _paymentMethod.isActive = true;
    for(const paymentMethod of this.paymentMethods){
      if(paymentMethod.value !== _paymentMethod.value){
        paymentMethod.isActive = false;
      }
    }
  }

}
