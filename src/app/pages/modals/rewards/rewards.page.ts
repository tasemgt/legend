import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, LoadingController } from '@ionic/angular';

import { Clipboard } from '@ionic-native/clipboard/ngx';
import { Reward, Redeem } from 'src/app/models/reward';
import { RewardsService } from 'src/app/services/rewards.service';
import { HttpErrorResponse } from '@angular/common/http';
import { myEnterAnimation2, myEnterAnimation } from 'src/app/animations/enter';
import { SeeMorePage } from './see-more/see-more.page';
import { UtilService } from 'src/app/services/util.service';
import { RedeemsPage } from './redeems/redeems.page';
import { myLeaveAnimation } from 'src/app/animations/leave';

@Component({
  selector: 'app-rewards',
  templateUrl: './rewards.page.html',
  styleUrls: ['./rewards.page.scss'],
})
export class RewardsPage implements OnInit {

  public referral: string;
  public referralDisp: string;
  public rewards: Reward;

  public redeems: Redeem[];

  public showLoading: boolean;

  constructor(
    private modalCtrl: ModalController,
    private clipboard: Clipboard,
    private rewardsService: RewardsService,
    private utilService: UtilService,
    private loadingCtrl: LoadingController) { 

  }

  ngOnInit() {
    this.getRewards();
  }

  public copyLink(){
    this.clipboard.copy(this.referral)
      .then(() =>{
        this.utilService.showToast(`Referral link copied <br><strong>${this.referral}<strong>`, 3000, 'success');
      });
  }

  private getRewards(){
    this.showLoading = true;
    this.rewardsService.getRewards()
    .then((rewards) =>{
      this.showLoading = false;
      this.rewards = rewards;
      this.referral = this.rewards.referal;
      this.referralDisp = `....${this.referral.substring(this.referral.indexOf('/register'))}`;
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

  public async openRedeemsModal(){

    this.utilService.presentLoading('')
      .then(() =>{
        return this.rewardsService.getRedeems();
      })
      .then( async (redeems) =>{
        this.loadingCtrl.dismiss();
        this.redeems = redeems;
        const modal = await this.modalCtrl.create({
          component: RedeemsPage,
          enterAnimation: myEnterAnimation,
          leaveAnimation: myLeaveAnimation,
          componentProps: {'redeems': this.redeems, 'rewards': this.rewards}
        });

        await modal.present();
      })
      .catch((err) =>{
        console.log(err);
      });
  }


  private getMyRedeems(): void{
    
  }

  public numberIt(digits:string){
    return Number(digits);
  }
  
  public closeModal(){
    this.modalCtrl.dismiss();
  }

}
