import { Injectable } from '@angular/core';
import { Constants } from '../models/constants';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { WalletService } from './wallet.service';

@Injectable({
  providedIn: 'root'
})
export class FundTransferService {

  private baseUrl = Constants.baseUrl;

  constructor(
    private auth: AuthService,
    private walletService: WalletService,
    private http: HttpClient) { }

  public doTransferFunds(payload: any): Promise<any>{
    return this.auth.getUser()
      .then((user) =>{
        const headers = {Authorization: `Bearer ${user.token}`, Accept: 'application/json', 'Content-Type': 'application/json'};
        return this.http.post(`${this.baseUrl}/funds-transfer`, payload, {headers} ).toPromise();
      })
      .then((resp:any) => {
        if (resp.code === 100){
          this.walletService.balanceState.next(true);
        }
        return Promise.resolve(resp);
      })
      .catch(err => console.log(err) );
  }

  public bankTransfer(action:string, payload?: any): Promise<any>{
    const url  = 'http://41.73.8.123/horizonaccess/legend/public/api/v3'; //Version 3 url
    return this.auth.getUser()
      .then((user) =>{
        const headers = {Authorization: `Bearer ${user.token}`, Accept: 'application/json', 'Content-Type': 'application/json'};
        if(action === 'bvn'){
          return this.http.post(`${url}/bvn`, payload, {headers} ).toPromise();
        }
        if(action === 'banklist'){
          return this.http.get(`${url}/bank-transfer`, {headers} ).toPromise();
        }
        else if(action === 'verify'){
          return this.http.post(`${url}/bank-transfer`, payload, {headers} ).toPromise();
        }
        return this.http.post(`${url}/bank-transfer-confirm`, payload, {headers} ).toPromise();
      })
      .then((resp:any) => {
        return Promise.resolve(resp);
      })
      .catch(err => console.log(err) );
  }
}
