import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-voucher-fund',
  templateUrl: './voucher-fund.page.html',
  styleUrls: ['./voucher-fund.page.scss'],
})
export class VoucherFundPage implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  public fundWalletWithVoucher(form: NgForm){

  }

  public closeModal(){
    this.modalCtrl.dismiss();
  }
}
