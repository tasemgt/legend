import { Component, OnDestroy, AfterViewInit } from '@angular/core';

import { Platform, ModalController, LoadingController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Subscription } from 'rxjs';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility/ngx';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { Constants } from './models/constants';
import { UtilService } from './services/util.service';
import { WalletService } from './services/wallet.service';
import { Balance } from './models/wallet';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements  OnDestroy, AfterViewInit{

  backButtonSubscription: Subscription;
  constants = Constants;

  constructor(
    private platform: Platform,
    private onesignal: OneSignal,
    private splashScreen: SplashScreen,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private mobileAccessibility: MobileAccessibility,
    private appMinimize: AppMinimize,
    private statusBar: StatusBar,
    private router: Router,
    private authService: AuthService,
    private walletService: WalletService,
    private userService: UserService,
    private util: UtilService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      
      // Handles zoom fonts on android devices
      this.mobileAccessibility.usePreferredTextZoom(false);

      // Handles status bar display 
      if (this.platform.is('android') || this.platform.is('ios')) {
        this.statusBar.overlaysWebView(false);
        this.statusBar.backgroundColorByHexString('#000000');
      }

      if (this.platform.is('ios')) {
        this.statusBar.overlaysWebView(false);
        this.statusBar.styleLightContent();
        this.statusBar.backgroundColorByHexString('#000000');
      }

      this.authService.authState.subscribe(async (state) => {
        if (state === true) {
          console.log('Go to tabs, you\'re logged in');
          this.router.navigateByUrl('/tabs');
        } else if (state === false) {
          console.log('You\'re logged out');
          let isModalOpened = await this.modalCtrl.getTop();
          if(isModalOpened){
            this.modalCtrl.dismiss().then(async() =>{
              isModalOpened = await this.modalCtrl.getTop();
              if(isModalOpened){
                this.modalCtrl.dismiss().then(async() =>{
                  isModalOpened = await this.modalCtrl.getTop();
                  if(isModalOpened){
                    this.modalCtrl.dismiss();
                  }
                });
              }
            });
          }
          this.router.navigateByUrl('/login');
        }
      });

      if(this.platform.is('capacitor') || this.platform.is('cordova')){
        console.log('Setting up push notifications');
        this.setupPushNotifications();
      }
    });
  }

  // Handles back button to close app on android
  ngAfterViewInit() {
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(0, async () => {
      const isLoading =  this.loadingCtrl.getTop();
      const isModalOpened = await this.modalCtrl.getTop();

      if(isLoading){
        this.loadingCtrl.dismiss();
      }

      const url = this.router.url.toString();
      if((url === '/tabs/home' || url === '/tabs/wallet' || url === '/tabs/profile') && isModalOpened){
        this.modalCtrl.dismiss();
      }

      else if(url === '/tabs/wallet' || url === '/tabs/profile' || url === '/tabs/logs'){
        this.router.navigateByUrl('/tabs/home');
      }

      else{
        this.appMinimize.minimize();
        // navigator['app'].exitApp();
      }
    });
  }


  private setupPushNotifications(){
    this.onesignal.startInit(Constants.oneSignalAppID, Constants.googleProjectNumberSenderID);

    this.onesignal.inFocusDisplaying(this.onesignal.OSInFocusDisplayOption.None);

    this.onesignal.handleNotificationOpened().subscribe(data =>{
      // this.util.presentAlert(
      //   `${data.notification.payload.body}, title: ${data.notification.payload.title}, additional: ${data.notification.payload.additionalData}`
      // );
      console.log('Notification Data..',data.notification.payload.body);
      // this.router.navigateByUrl('/tabs/wallet');
    });

    this.onesignal.handleNotificationReceived().subscribe(data =>{
      console.log('Notificatins received');
    });

    this.onesignal.endInit();
    this.registerPlayerId();

    // this.onesignal.
  }

  private async registerPlayerId(){
    const balance:Balance = await this.walletService.getBalance();
    if(balance.notification_id === 'NO'){
      const playerId = await this.onesignal.getIds();
      console.log('PlayerID>> ',playerId);
      await this.userService.registerNotificationId({notification_id: playerId.userId});
    }
  }

  ngOnDestroy() {
    this.backButtonSubscription.unsubscribe();
  }
}
