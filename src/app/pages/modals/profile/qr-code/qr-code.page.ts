import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Profile } from 'src/app/models/user';

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.page.html',
  styleUrls: ['./qr-code.page.scss'],
})
export class QrCodePage implements OnInit {

  public profile: Profile;

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams) {

      this.profile = this.navParams.get('profile');
  }

  ngOnInit() {
  }

  public closeModal(){
    this.modalCtrl.dismiss();
  }

}
