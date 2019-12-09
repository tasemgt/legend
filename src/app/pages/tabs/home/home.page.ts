import { Component, OnInit, OnDestroy } from '@angular/core';
import { WalletService } from 'src/app/services/wallet.service';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { UtilService } from 'src/app/services/util.service';
import { ModalController } from '@ionic/angular';

import { Balance } from 'src/app/models/wallet';
import { BuyBundlePage } from '../../modals/buy-bundle/buy-bundle.page';
import { Network } from '@ionic-native/network/ngx';
import { BundleService } from 'src/app/services/bundle.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit, OnDestroy{

  user: User;
  greetMsg: string;
  balance: Balance;
  daysLeft: number;

  authSubscription: Subscription;
  balanceSubscription: Subscription;
  connectSubscription: Subscription;
  disconnectSubscription: Subscription;

  constructor(
    private network: Network,
    private authService: AuthService,
    private modalCtrl: ModalController,
    private walletService: WalletService,
    private bundleService: BundleService,
    private utilService: UtilService) {}

  ngOnInit(){

    // // watch network for a connection
    // this.connectSubscription = this.network.onConnect().subscribe(() => {
    //   console.log('network connected!');
    //   this.getBalance('network');
    // });

    // // watch network for a disconnection
    // this.disconnectSubscription = this.network.onDisconnect().subscribe(() => {
    //   console.log('network was disconnected :-(');
    //   this.utilService.showToast('Your network is disconnected, please check..', 3000, 'danger');
    //   this.getBalance('storage');
    // });
    
    this.authSubscription = this.authService.getAuthStateSubject().subscribe((state) =>{
      //Do one time stuff on login here. i.e when state changes from false to true;
      if(state){
        console.log("new login..")
        this.balanceSubscription = this.walletService.balanceState.subscribe((balance) =>{
          this.getBalance();
        });
        this.getUser();
        this.getBalance();
      }
    });
  }

  ionViewWillEnter(){
    this.greetMsg = this.utilService.greetMessage();
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

  private getBalance(from?: string){
    this.walletService.getBalance().then((balance) =>{
      this.balance = balance;
      //this.bundleService.setBundleBalanceToStorage(this.balance);
      this.daysLeft = this.getDaysLeft(balance.expiry); // Computes remaining days of bundle..
    }).catch(err => {
      this.balance.balance = '0.00';
      console.log(err);
    });
    // if(from === 'storage'){
    //   console.log("from storage")
    //   this.bundleService.getBundleBalanceFromStorage()
    //     .then((balance) =>{
    //       this.balance = balance;
    //       this.daysLeft = this.getDaysLeft(balance.expiry); // Computes remaining days of bundle..
    //     }).catch(err => {
    //       this.balance.balance = '0.00';
    //       console.log(err);
    //     });
    // }
    // else if(from === 'network'){
    //   console.log("from network")
    //   this.walletService.getBalance().then((balance) =>{
    //     this.balance = balance;
    //     this.bundleService.setBundleBalanceToStorage(this.balance);
    //     this.daysLeft = this.getDaysLeft(balance.expiry); // Computes remaining days of bundle..
    //   }).catch(err => {
    //     this.balance.balance = '0.00';
    //     console.log(err);
    //   });
    // }
  }

  private getDaysLeft(expDate: string): number{
    const dateArr = expDate.split('/');
    const newExpDate = `${dateArr[1]}/${dateArr[0]}/${dateArr[2]}`;
    const eD = new Date(newExpDate); const now = new Date();
    return this.utilService.getDateDifference(eD, now);
  }

  // On Destroy of the home component..
  ngOnDestroy(){
    this.balanceSubscription.unsubscribe();
    this.authSubscription.unsubscribe();
    // if(this.connectSubscription){
    //   this.connectSubscription.unsubscribe();
    // }
    // if(this.disconnectSubscription){
    //   this.disconnectSubscription.unsubscribe();
    // }
  }

}
