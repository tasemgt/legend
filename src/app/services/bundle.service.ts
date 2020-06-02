import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../models/constants';
import { AuthService } from './auth.service';
import { User } from '../models/user';
import { WalletService } from './wallet.service';
import { BehaviorSubject } from 'rxjs';

import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class BundleService{

  constructor(
    private storage: Storage,
    private http: HttpClient, 
    private authService: AuthService,
    private walletService: WalletService) { 
      this.balanceState = this.walletService.getBalanceState();
    }

  private baseUrl = Constants.baseUrl;
  private user: User;
  private balanceState: BehaviorSubject<boolean>;


  public getBundleTypes(): Promise<any>{
    return this.authService.getUser()
      .then(user => {
        const headers = {Authorization: `Bearer ${user.token}`, Accept: 'application/json', 'Content-Type': 'application/json'};
        return this.http.get(`${this.baseUrl}/bundle-list`, {headers}).toPromise();
      })
      .then((response: any) =>{
        console.log(response);
        return Promise.resolve(response);
      });
  }

  public getBundle(){
    this.http.get(`${this.baseUrl}/balance`, {headers: {'Content-Type': 'application/json'}})
      .subscribe(resp =>{
        console.log(resp);
      })
  }

  public renewBundle(payload: any): Promise<any>{
    return this.authService.getUser()
      .then(user => {
        const headers = {Authorization: `Bearer ${user.token}`, Accept: 'application/json', 'Content-Type': 'application/json'};
        return this.http.post(`${this.baseUrl}/renewals`, payload, {headers} ).toPromise()
      })
      .then((resp:any) => {
        if (resp.code === 100){
          this.balanceState.next(true); 
        }
        return Promise.resolve(resp);
      })
      .catch(err => console.log(err) );
  }

  public buyBundle(payload: any): Promise<any>{
    return this.authService.getUser()
      .then(user => {
        const headers = {Authorization: `Bearer ${user.token}`, Accept: 'application/json', 'Content-Type': 'application/json'};
        return this.http.post(`${this.baseUrl}/subscribe`, payload, {headers} ).toPromise()
      })
      .then((resp:any) => {
        if (resp.code === 100){
          this.balanceState.next(true); //Ibro should give balance back
        }
        return Promise.resolve(resp);
      })
      .catch(err => console.log(err) );
  }

  public setBundleBalanceToStorage(balance:any){
    this.storage.set('balance', balance);
  }

  public getBundleBalanceFromStorage(){
    return this.storage.get('balance');
  }

}
