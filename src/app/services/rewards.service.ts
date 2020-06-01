import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Reward } from '../models/reward';

@Injectable({
  providedIn: 'root'
})
export class RewardsService {

  public rewards: Reward;

  constructor(
    private http: HttpClient,
    private authService: AuthService) {

  }

  public getRewards(): Promise<any>{
    const baseUrl = 'http://41.73.8.123/horizonaccess/legend/public/api';
    return this.authService.getUser()
     .then(user => {
       const headers = {Authorization: `Bearer ${user.token}`, 'Content-Type': 'application/json'};
       return this.http.get(`${baseUrl}/rewards`, {headers}).toPromise()
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
    const baseUrl = 'http://41.73.8.123/horizonaccess/legend/public/api';
    return this.authService.getUser()
    .then(user => {
      const headers = {Authorization: `Bearer ${user.token}`, 'Content-Type': 'application/json'};
      return param ? this.http.get(`${baseUrl}/redeem/${param}`, {headers}).toPromise(): this.http.get(`${baseUrl}/redeem`, {headers}).toPromise();
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
    const baseUrl = 'http://41.73.8.123/horizonaccess/legend/public/api';
    return this.authService.getUser()
    .then(user => {
      const headers = {Authorization: `Bearer ${user.token}`, 'Content-Type': 'application/json'};

      if(pid !== undefined){
        pid = pid.toString();
        return this.http.post(`${baseUrl}/redeem/${itemId}/confirm`, {pid}, {headers}).toPromise()
      }
      return this.http.get(`${baseUrl}/redeem/${itemId}/confirm`, {headers}).toPromise()
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
