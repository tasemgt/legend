import { Injectable } from '@angular/core';
import { Constants } from '../models/constants';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { WalletService } from './wallet.service';

@Injectable({
  providedIn: 'root'
})
export class FundTransferService {

  private baseUrl = 'http://41.73.8.123/horizonaccess/legend/public/api';

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
}
