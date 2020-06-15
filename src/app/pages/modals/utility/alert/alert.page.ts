import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.page.html',
  styleUrls: ['./alert.page.scss'],
})
export class AlertPage implements OnInit {

  public content: any;

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams) {
      this.content = this.navParams.get('content');
  }

  ngOnInit() {
  }

  public closeModal(){
    this.modalCtrl.dismiss();
  }

}
