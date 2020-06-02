import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { WalletService } from './wallet.service';
import { Constants } from '../models/constants';


@Injectable({
  providedIn: 'root'
})
export class PayForFriendService {

  private baseUrl = Constants.baseUrl;

  constructor(
    private auth: AuthService,
    private walletService: WalletService,
    private http: HttpClient) { }


  
  public searchUser(username:string): Promise<any>{
    return this.auth.getUser()
      .then((user) =>{
        const headers = {Authorization: `Bearer ${user.token}`, Accept: 'application/json', 'Content-Type': 'application/json'};
        return this.http.post(`${this.baseUrl}/fund-friend`, {username}, {headers} ).toPromise();
      })
      .then((resp:any) => {
        return Promise.resolve(resp);
      })
      .catch(err => Promise.reject(err) );
  }

  public makePayment(payload: {username:string, type:string}, productID:number): Promise<any>{
    return this.auth.getUser()
      .then((user) =>{
        const headers = {Authorization: `Bearer ${user.token}`, Accept: 'application/json', 'Content-Type': 'application/json'};
        return this.http.post(`${this.baseUrl}/fund-friend-confirm/${productID}`, payload, {headers} ).toPromise();
      })
      .then((resp:any) => {
        return Promise.resolve(resp);
      })
      .catch(err => Promise.reject(err) );
  }
  
}
