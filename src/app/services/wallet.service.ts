import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { AuthService } from './auth.service';
import { Constants } from '../models/constants';
import { User } from '../models/user';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  private baseUrl = Constants.baseUrl;
  private user: User;

  public balanceState: BehaviorSubject<boolean> = new BehaviorSubject(null);

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private storage: Storage) {}

  public getBalance(): Promise<any>{
     return this.authService.getUser()
      .then(user => {
        this.user = user;
        const headers = {Authorization: `Bearer ${user.token}`, 'Content-Type': 'application/json'};
        return this.http.get(`${this.baseUrl}/balance`, {headers}).toPromise()
      })
      .then(resp => {
        return Promise.resolve(resp);
      })
      .catch(err => console.log(err));
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
