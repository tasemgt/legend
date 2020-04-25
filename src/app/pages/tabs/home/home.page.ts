import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { WalletService } from 'src/app/services/wallet.service';
import { User, Profile } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { UtilService } from 'src/app/services/util.service';
import { ModalController, Platform } from '@ionic/angular';

import { Balance } from 'src/app/models/wallet';
import { BuyBundlePage } from '../../modals/bundles/buy-bundle/buy-bundle.page';
import { Network } from '@ionic-native/network/ngx';
import { BundleService } from 'src/app/services/bundle.service';

import { Flip } from 'number-flip';
import { BundleDetailsPage } from '../../modals/bundles/bundle-details/bundle-details.page';
import { UserService } from 'src/app/services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { myEnterAnimation } from 'src/app/animations/enter';
import { myLeaveAnimation } from 'src/app/animations/leave';

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
  showIosOnce: boolean;
  subscribeNow: boolean;
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
    private platform: Platform,
    private router: Router,
    private utilService: UtilService) {

      this.subscribeNow = false;
      this.showIosOnce = true;
    }

  ngOnInit(){
    this.authSubscription = this.authService.getAuthStateSubject().subscribe((state) =>{
      //Do one time stuff on login here. i.e when state changes from false to true;
      if(state){
        console.log("Login occured..")
        console.log(this.daysLeft);
        this.authService.getUser().then(user => {
          this.user = user;
          this.getBalance();
          this.getProfile(user);
        });
        
      }
      else{
        //this.balance.resetBalance();
        this.profile.username = '';
        this.daysLeft = '';
        this.balance = null;
        this.rotateCirclePos = 0;
        this.subscribeNow = false;
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

    this.displaySubNow();
  }

  public async openBundleDetailsModal(){
    if(!this.balance){
      return;
    }
    const modal = await this.modalCtrl.create({
      component: BundleDetailsPage,
      enterAnimation: myEnterAnimation,
      leaveAnimation: myLeaveAnimation,
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
      console.log("Show me here ", balance);
      //this.bundleService.setBundleBalanceToStorage(this.balance);
      if(balance){
        this.displaySubNow(balance);
        if(balance.expiry === '---'){
          return this.daysLeft = '---';
        }
        this.daysLeft = this.getDaysLeft(balance.expiry).toString(); // Computes remaining days of bundle..
        console.log("Days Left>>>> ",this.daysLeft);
      }
      
      const daysChopped = 30 - Number(this.daysLeft);
      this.rotateCirclePos = daysChopped * 360 / 30;
    }).catch((err: HttpErrorResponse) => {
      if(err.status === 0){
        setTimeout(() =>{
          if(this.platform.is('android') || (this.platform.is('ios') && this.showIosOnce)){
            this.utilService.showToast('Check network connectivity..', 1000, 'danger');
            this.showIosOnce = false; 
          }
          this.getBalance(); // Call get balance again after 10secs;
        }, 15000);
        
      }
    });
  }


  private getProfile(user: User){
    this.userService.getUserProfile(user)
    .then((profile) =>{
      this.profile = profile;
    })
    .catch((err: HttpErrorResponse) =>{
      if(err.status === 0){
        setTimeout(() =>{
          this.getProfile(user); // Call get balance again after 10secs;
        }, 15000);
      }
    })
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

  private displaySubNow(balance?){
    if(this.balance){
      if(((Number(this.balance.raw_prod_balance)/100) < this.balance.price) && this.balance.expiry_days <= 1){
        this.subscribeNow = true;
        console.log(this.subscribeNow);
        return;
      }
      this.subscribeNow = false;
      console.log(this.subscribeNow);
    }
  }

  public onRotateCircle() {
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

  goToTab(tabName: string){
    this.router.navigateByUrl(`/tabs/${tabName}`);
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
