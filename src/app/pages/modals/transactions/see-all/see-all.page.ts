import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Transaction } from 'src/app/models/transaction';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-see-all',
  templateUrl: './see-all.page.html',
  styleUrls: ['./see-all.page.scss'],
})
export class SeeAllPage implements OnInit {

  public transactions: Transaction[];

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private utilService: UtilService) {

      this.transactions = this.navParams.get('transactions');

  }

  ngOnInit() {
  }

  public formatWithCommas(numb: any){
    return this.utilService.numberWithCommas(numb);
  }

  public closeModal(){
    this.modalCtrl.dismiss();
  }

  public generateReceipt(transaction: Transaction){
    this.utilService.generateReceipt(transaction);
  }
}
