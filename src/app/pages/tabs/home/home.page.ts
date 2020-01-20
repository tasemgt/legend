import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { WalletService } from 'src/app/services/wallet.service';
import { User, Profile } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { UtilService } from 'src/app/services/util.service';
import { ModalController } from '@ionic/angular';

import { Balance } from 'src/app/models/wallet';
import { BuyBundlePage } from '../../modals/buy-bundle/buy-bundle.page';
import { Network } from '@ionic-native/network/ngx';
import { BundleService } from 'src/app/services/bundle.service';

import { Flip } from 'number-flip';
import { BundleDetailsPage } from '../../modals/bundle-details/bundle-details.page';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit, OnDestroy{

  user: User;
  profile: Profile;
  greetMsg: string;
  balance: Balance;
  daysLeft: string;

  authSubscription: Subscription;
  balanceSubscription: Subscription;
  connectSubscription: Subscription;
  disconnectSubscription: Subscription;

  rotateCircle: boolean;
  rotateCirclePos: number;

  @ViewChild('numberFlip', {static:false}) private numberFlip: ElementRef;
  flipAnim = null;

  constructor(
    private network: Network,
    private authService: AuthService,
    private userService: UserService,
    private modalCtrl: ModalController,
    private walletService: WalletService,
    private bundleService: BundleService,
    private utilService: UtilService) {
    }

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
        console.log("Login occured..")
        this.authService.getUser().then(user => {
          this.user = user;
          this.getBalance();
          return this.userService.getUserProfile(user);
        })
        .then((profile) =>{
          this.profile = profile;
        });
      }
      else{
        this.profile.username = '';
        this.daysLeft = '';
        this.balance.balance = '';
        this.balance.bundle = '';
        this.rotateCirclePos = 0;
      }
    });

    this.balanceSubscription = this.walletService.balanceState.subscribe((balance) =>{
      if(balance){
        this.getBalance();
      }
    });
  }

  ionViewWillEnter(){
    this.greetMsg = this.utilService.greetMessage();
    this.rotateCircle = false;
    //this.flip();
  }

  public async openBundleDetailsModal(){
    const modal = await this.modalCtrl.create({
      component: BundleDetailsPage,
      componentProps: {'balance': this.balance, 'profile': this.profile}
    });
    return await modal.present();
  }
  
  private getUser(){
    this.authService.getUser().then(user => this.user = user);
  }

  private getBalance(from?: string){
    this.walletService.getBalance().then((balance: Balance) =>{
      this.balance = balance;
      //this.bundleService.setBundleBalanceToStorage(this.balance);
      if(balance.expiry === '---'){
        return this.daysLeft = '---';
      }
      this.daysLeft = this.getDaysLeft(balance.expiry).toString(); // Computes remaining days of bundle..
      console.log(this.daysLeft);
      
      const daysChopped = 30 - Number(this.daysLeft);
      this.rotateCirclePos = daysChopped * 360 / 30;
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

  public openManageDevices(): void{
    window.open('http://device.legendselfcare.ng/', '_system', 'location=yes');
  }


  private getDaysLeft(expDate: string): number{
    const dateArr = expDate.split('-');
    const newExpDate = `${dateArr[0]}/${dateArr[1]}/${dateArr[2]}`;
    const eD = new Date(newExpDate); const now = new Date();
    return this.utilService.getDateDifference(eD, now);
  }

  public onRotateCircle(){
    this.rotateCircle = true;
  }

  flip() {
    if (!this.flipAnim) {
      this.flipAnim = new Flip({
        node: this.numberFlip.nativeElement,
        from: '90',
        to: '10'
      });
    }
   
    // this.flipAnim.flipTo({
    //   to: '10'
    // });
  }

  ionViewWillLeave(){
    //this.rotateCircle = ;
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
