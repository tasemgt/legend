import { Component, OnInit, OnDestroy } from '@angular/core';
import { WalletService } from 'src/app/services/wallet.service';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { UtilService } from 'src/app/services/util.service';
import { ModalController } from '@ionic/angular';
import { BuyBundlePage } from 'src/app/page/modals/buy-bundle/buy-bundle.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit, OnDestroy{

  user: User;
  greetMsg: string;
  balance: string;
  balanceSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private modalCtrl: ModalController,
    private walletService: WalletService,
    private utilService: UtilService) {}

  ngOnInit(){

    this.balanceSubscription = this.walletService.balanceState.subscribe((balance) =>{
      this.getBalance();
    });

    this.greetMsg = this.utilService.greetMessage();
    this.getUser();
    this.getBalance();
  }

  public async openBuyBundleModal(){
    const modal = await this.modalCtrl.create({
      component: BuyBundlePage,
    });
    return await modal.present();
  }
  
  private getUser(){
    this.authService.getUser().then(user => this.user = user);
  }

  private getBalance(){
    this.walletService.getBalance().then((resp) =>{
      this.balance = resp.balance;
    }).catch(err => {
      this.balance = '0.00';
      console.log(err);
    });
  }

  ngOnDestroy(){
    this.balanceSubscription.unsubscribe();
  }
}
