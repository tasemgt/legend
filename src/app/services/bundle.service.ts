import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../models/constants';
import { AuthService } from './auth.service';
import { User } from '../models/user';
import { WalletService } from './wallet.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BundleService{

  constructor(
    private http: HttpClient, 
    private authService: AuthService,
    private walletService: WalletService) { 
      this.balanceState = this.walletService.getBalanceState();
    }

  private baseUrl = Constants.baseUrl;
  private user: User;
  private balanceState: BehaviorSubject<boolean>;


  public getBundleTypes(): Promise<any>{
    return this.http.get(`${this.baseUrl}/bundle-list`).toPromise()
      .then((bundles) =>{
        return Promise.resolve(bundles);
      })
  }

  public getBundle(){
    this.http.get(`${this.baseUrl}/balance`, {headers: {'Content-Type': 'application/json'}})
      .subscribe(resp =>{
        console.log(resp);
      })
  }

  public buyBundle(payload: any): Promise<any>{
    return this.authService.getUser()
      .then(user => {
        const headers = {Authorization: `Bearer ${user.token}`, Accept: 'application/json', 'Content-Type': 'application/json'};
        return this.http.post(`${this.baseUrl}/buy-bundle`, payload, {headers} ).toPromise()
      })
      .then((resp:any) => {
        if (resp.code === 100){
          this.balanceState.next(true); //Ibro should give balance back
        }
        return Promise.resolve(resp);
      })
      .catch(err => console.log(err) );
  }

}
