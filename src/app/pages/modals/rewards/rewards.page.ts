import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

import { Clipboard } from '@ionic-native/clipboard/ngx';
import { Reward } from 'src/app/models/reward';
import { RewardsService } from 'src/app/services/rewards.service';
import { HttpErrorResponse } from '@angular/common/http';
import { myEnterAnimation2 } from 'src/app/animations/enter';
import { SeeMorePage } from './see-more/see-more.page';

@Component({
  selector: 'app-rewards',
  templateUrl: './rewards.page.html',
  styleUrls: ['./rewards.page.scss'],
})
export class RewardsPage implements OnInit {

  public referral: string;
  public rewards: Reward;

  public showLoading: boolean;

  constructor(
    private modalCtrl: ModalController,
    private clipboard: Clipboard,
    private rewardsService: RewardsService) { 

  }

  ngOnInit() {
    this.getRewards();
  }

  public copyLink(){
    this.clipboard.copy(this.referral);
  }

  private getRewards(){
    this.showLoading = true;
    this.rewardsService.getRewards()
    .then((rewards) =>{
      this.showLoading = false;
      this.rewards = rewards;
      this.referral = this.rewards.referal;
    })
    .catch((err: HttpErrorResponse) =>{
      if(err.status === 0){
        setTimeout(() =>{
          this.getRewards(); // Call get rewards again after 10secs;
        }, 10000);
      }
    })
  }

  public async openSeeMoreModal(){
    const modal = await this.modalCtrl.create({
      component: SeeMorePage,
      enterAnimation: myEnterAnimation2,
      componentProps: {'rewards': this.rewards}
    });
    await modal.present();
  }

  public numberIt(digits:string){
    return Number(digits);
  }
  
  public closeModal(){
    this.modalCtrl.dismiss();
  }

}
