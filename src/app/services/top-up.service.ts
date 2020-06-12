import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { InAppBrowser, InAppBrowserEvent } from '@ionic-native/in-app-browser/ngx';

import { Constants } from '../models/constants';
import { AuthService } from './auth.service';
import { Subscription, Subject } from 'rxjs';
import { WalletService } from './wallet.service';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class TopUpService implements OnDestroy {

  private baseUrl = Constants.baseUrl;
  private paymentResponse; noResponse;
  private loadStopSub: Subscription;

  private responseSubject = new Subject<any>();

  constructor(
    private iab: InAppBrowser,
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private walletService: WalletService) { }

  // Function to Handle requests for pay url and response for fund wallet modal
  public async makePayment(amount: string){
    const user = await this.authService.getUser();
    const headers = { Authorization: `Bearer ${user.token}`, Accept: 'application/json'};
    return this.http.post(`${this.baseUrl}/webpay`, {amount}, {headers}).toPromise()
      .then((resp) =>{
        console.log(resp);
      })
      .catch((err) =>{
        console.log(err); // Ask why it is giving me response on error sha..
        if(err.status === 0){
          return Promise.resolve({message: 'Connection unsuccessful, check network and try again'});
        }
        if(err.error.code === 100){
          console.log(err.error.url);
          const url = `${err.error.url}`;
          this.openBrowser(url)
          .subscribe((event) => {
              this.responseSubject.next(this.paymentResponse);
          });
        }
        else{
          return Promise.resolve({message: 'An error occured, payment unsuccessful'});
        }
      });
  }

  // Function to handle browser related stuff...
  private openBrowser(url: string){
    this.loadingCtrl.dismiss();
    const browser = this.iab.create(url, '_blank', `
    location=no,zoom=no,useWideViewPort=no,closebuttoncolor=#ffffff,
    hidenavigationbuttons=yes,hideurlbar=yes,toolbarcolor=#2C3038`);

    // Listens for browser fully load and excutes scripts for completion url on Pay
    this.loadStopSub = browser.on('loadstop')
      .subscribe((event: InAppBrowserEvent) => {
        browser.executeScript({code:`
        if(window.location.pathname.includes('/api/legendpay/verify') || window.location.pathname.includes('/api/saved/verify')){
          console.log("Exect script gave a true for this");
          document.getElementsByTagName('h1')[0].innerHTML
        }
        else if(window.location.pathname.includes('/api/legendpay/failed')){
          console.log("Exect script gave a true for this");
          document.getElementsByTagName('h1')[0].innerHTML
        }
        else{
          console.log("Exect script gave a false for this");
        }
        `}).then((resp) =>{ // Traps the innerHTML value of the Pre tag. This contains the json response
          if(resp[0]){
            this.paymentResponse = resp[0];
            console.log(this.paymentResponse);
            setTimeout(() => {
              browser.close();
            }, 3000);
          }
        });
    });

    // Returns a listen on exit or closing of browser
    return browser.on('exit');
  }


  public getResponseSubject(){
    return this.responseSubject;
  }


  public fundWithVoucher(payload: {serial:string, pin:string}){
    return this.authService.getUser()
      .then((user) =>{
        const headers = {Authorization: `Bearer ${user.token}`, Accept: 'application/json', 'Content-Type': 'application/json'};
        return this.http.post(`${this.baseUrl}/voucher`, payload, {headers} ).toPromise();
      })
      .then((resp:any) => {
        if (resp.code === 100){
          this.walletService.balanceState.next(true);
        }
        return Promise.resolve(resp);
      })
      .catch(err => console.log(err) );
  }

  ngOnDestroy(){
    this.loadStopSub.unsubscribe();
  }
}