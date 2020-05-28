import { Component, OnInit } from '@angular/core';
import { Reward } from 'src/app/models/reward';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-see-more',
  templateUrl: './see-more.page.html',
  styleUrls: ['./see-more.page.scss'],
})
export class SeeMorePage implements OnInit {

  public rewards: Reward;

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams) {

      this.rewards = this.navParams.get('rewards');
  }

  ngOnInit() {
  }

  public numberIt(digits:string){
    return Number(digits);
  }

  public closeModal(){
    this.modalCtrl.dismiss();
  }

}
