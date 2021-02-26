import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { AuthService } from './auth.service';
import { Constants } from '../models/constants';
import { User } from '../models/user';
import { BehaviorSubject } from 'rxjs';
import { Balance } from '../models/wallet';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  private baseUrl = Constants.baseUrl;
  private user: User;

  public balanceState: BehaviorSubject<boolean> = new BehaviorSubject(null);

  public uniBalanceValue: Balance;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private storage: Storage) {

      this.getUniveralBalance();
      this.balanceState.subscribe((reloadBal) =>{
        if(reloadBal){
          this.getUniveralBalance();
        }
      });

      this.authService.authState.subscribe((loggedIn) =>{
        if(loggedIn){
          this.getUniveralBalance();
        }else{
          this.uniBalanceValue = {} as Balance;
        }
      });
  }

  private getUniveralBalance(){
    let counter = 1;
    this.getBalance()
      .then((bal) =>{
        this.uniBalanceValue = bal; // Store universal balance value
      }).catch((err) =>{
        if(err.status === 0){
          setTimeout(() =>{
            if(counter >= 10){
              return;
            }
            counter++;
            console.log(counter);
            this.getBalance();
          }, 100);
        }
      });
  }

  public getBalance(): Promise<any>{
    const url  = 'http://41.73.8.123/horizonaccess/legend/public/api/v2'; //Test Url
    return this.authService.getUser()
      .then(user => {
        this.user = user;
        const headers = {Authorization: `Bearer ${user.token}`, 'Content-Type': 'application/json'};
        return this.http.get(`${url}/balance`, {headers}).toPromise()
      })
      .then(resp => {
        return Promise.resolve(resp);
      })
      .catch(err => {
        console.log(err)
        return Promise.reject(err);
      });
  }


  public getTransactions(): Promise<any>{
    return this.authService.getUser()
      .then(user => {
        this.user = user;
        const headers = {Authorization: `Bearer ${user.token}`, 'Content-Type': 'application/json'};
        return this.http.get(`${this.baseUrl}/wallet-transactions`, {headers}).toPromise()
      })
      .then(resp => {
        return Promise.resolve(resp);
      })
      .catch(err => {
        console.log(err)
        return Promise.reject(err);
      });
  }

  // public fundWallet(fundWalletObject: {amount:string}): Promise<any>{
  //   return this.authService.getUser()
  //     .then(user => {
  //       const headers = {Authorization: `Bearer ${user.token}`, 'Content-Type': 'application/json'};
  //       return this.http.post(`${this.baseUrl}/fund-wallet`, fundWalletObject, {headers} ).toPromise()
  //     })
  //     .then((resp:any) => {
  //       if (resp.code === 100){
  //         this.balanceState.next(true); //Ibro should give balance back
  //       }
  //       return Promise.resolve(resp);
  //     })
  //     .catch(err => console.log(err) );
  // }

  public getBalanceState(){
    return this.balanceState;
  }


}
