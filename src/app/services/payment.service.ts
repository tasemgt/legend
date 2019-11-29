import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { InAppBrowser, InAppBrowserEvent } from '@ionic-native/in-app-browser/ngx';

import { Constants } from '../models/constants';
import { AuthService } from './auth.service';
import { Subscription, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService implements OnDestroy {

  private baseUrl = Constants.baseUrl;
  private paymentResponse; noResponse;
  private loadStopSub: Subscription;

  private responseSubject = new Subject<any>();

  constructor(
    private iab: InAppBrowser,
    private http: HttpClient,
    private authService: AuthService) { }

  // Function to Handle requests for pay url and response for fund wallet modal
  public async makePayment(amount: string, paymentType: string){
    const user = await this.authService.getUser();
    const headers = { Authorization: `Bearer ${user.token}`, Accept: 'application/json'};
    this.http.post(`${this.baseUrl}/webpay`, {amount, paymentType}, {headers}).toPromise()
      .then((resp) =>{
        console.log(resp);
      })
      .catch((err) =>{
        console.log(err); // Ask why it is giving me response on error sha..
        if(err.error.code === 100){
          console.log(err.error.url);
          const url = `${err.error.url}?phone=${user.phone}`;
          this.openBrowser(url, paymentType)
          .subscribe((event) => {
              this.responseSubject.next(this.paymentResponse);
          });
        }
      });
  }

  // Function to handle browser related stuff...
  private openBrowser(url: string, paymentType: string){
    const browser = this.iab.create(url, '_blank', 'location=no');

    // Listens for browser fully load and excutes scripts for completion url on Pay
    this.loadStopSub = browser.on('loadstop')
      .subscribe((event: InAppBrowserEvent) => {
        browser.executeScript({code:`
        if(window.location.pathname.includes('/api/flutterwave/verify')){
          console.log("Exect script gave a true for this");
          document.getElementsByTagName('pre')[0].innerHTML
        }else{
          console.log("Exect script gave a false for this");
        }
        `}).then((resp) =>{
          if(resp[0]){
            this.paymentResponse = resp[0];
            browser.close();
          }
        });
    });

    // Returns a listen on exit or closing of browser
    return browser.on('exit');
  }


  public getResponseSubject(){
    return this.responseSubject;
  }

  ngOnDestroy(){
    this.loadStopSub.unsubscribe();
  }
}
