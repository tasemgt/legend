import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Transaction } from 'src/app/models/transaction';

@Component({
  selector: 'app-see-all',
  templateUrl: './see-all.page.html',
  styleUrls: ['./see-all.page.scss'],
})
export class SeeAllPage implements OnInit {

  public transactions: Transaction[];

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams) {

      this.transactions = this.navParams.get('transactions');

  }

  ngOnInit() {
  }

  public closeModal(){
    this.modalCtrl.dismiss();
  }
}
