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
}
