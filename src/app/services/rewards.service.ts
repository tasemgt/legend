import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Reward } from '../models/reward';
import { BehaviorSubject } from 'rxjs';
import { Constants } from '../models/constants';

@Injectable({
  providedIn: 'root'
})
export class RewardsService {

  private baseUrl = Constants.baseUrl;

  public rewards: Reward;

  public rewardState: BehaviorSubject<boolean> = new BehaviorSubject(null);

  constructor(
    private http: HttpClient,
    private authService: AuthService) {

  }

  public getRewards(): Promise<any>{
    return this.authService.getUser()
     .then(user => {
       const headers = {Authorization: `Bearer ${user.token}`, 'Content-Type': 'application/json'};
       return this.http.get(`${this.baseUrl}/rewards`, {headers}).toPromise()
     })
     .then(resp => {
       return Promise.resolve(resp);
     })
     .catch(err => {
       console.log(err)
       return Promise.reject(err);
     });
 }

  public getRedeems(param?: number): Promise<any>{
    return this.authService.getUser()
    .then(user => {
      const headers = {Authorization: `Bearer ${user.token}`, 'Content-Type': 'application/json'};
      return param ? this.http.get(`${this.baseUrl}/redeem/${param}`, {headers}).toPromise(): this.http.get(`${this.baseUrl}/redeem`, {headers}).toPromise();
    })
    .then(resp => {
      return Promise.resolve(resp);
    })
    .catch(err => {
      console.log(err)
      return Promise.reject(err);
    });
  }

  public doRedeem(itemId: number, pid?:number|string): Promise<any>{
    return this.authService.getUser()
    .then(user => {
      const headers = {Authorization: `Bearer ${user.token}`, 'Content-Type': 'application/json'};

      if(pid !== undefined){
        pid = pid.toString();
        return this.http.post(`${this.baseUrl}/redeem/${itemId}/confirm`, {pid}, {headers}).toPromise()
      }
      return this.http.get(`${this.baseUrl}/redeem/${itemId}/confirm`, {headers}).toPromise()
    })
    .then(resp => {
      return Promise.resolve(resp);
    })
    .catch(err => {
      console.log(err)
      return Promise.reject(err);
    });
  }

}
