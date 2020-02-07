import { Component, OnDestroy, AfterViewInit } from '@angular/core';

import { Platform, ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Subscription } from 'rxjs';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility/ngx';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements  OnDestroy, AfterViewInit{

  backButtonSubscription: Subscription;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private modalCtrl: ModalController,
    private mobileAccessibility: MobileAccessibility,
    private appMinimize: AppMinimize,
    private statusBar: StatusBar,
    private router: Router,
    private authService: AuthService
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

      this.authService.authState.subscribe(state => {
        if (state === true) {
          console.log('Go to tabs, you\'re logged in');
          this.router.navigateByUrl('/tabs');
        } else if (state === false) {
          console.log('You\'re logged out')
          this.router.navigateByUrl('/login');
        }
      });

    });
  }

  // Handles back button to close app on android
  ngAfterViewInit() {
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(0, async () => {
      console.log("Pressed...");
      const isModalOpened = await this.modalCtrl.getTop();
      const url = this.router.url.toString();
      if((url === '/tabs/home' || url === '/tabs/payment' || url === '/tabs/profile') && isModalOpened){
        this.modalCtrl.dismiss();
      }

      else if(url === '/tabs/payment' || url === '/tabs/profile' || url === '/tabs/logs'){
        this.router.navigateByUrl('/tabs/home');
      }

      else{
        this.appMinimize.minimize();
        // navigator['app'].exitApp();
      }
    });
  }

  ngOnDestroy() {
    this.backButtonSubscription.unsubscribe();
  }
}
