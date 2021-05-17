import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, Profile } from '../models/user';
import { Constants } from '../models/constants';

import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = Constants.baseUrl;

  constructor(private http: HttpClient) { }
  
  public async getUserProfile(user: User) : Promise<Profile>{
    const url = 'http://41.73.8.123/horizonaccess/legend/public/api/v2'; //Version 3 url
    const headers = {Authorization: `Bearer ${user.token}`, Accept: 'application/json', 'Content-Type': 'application/json'};
    try{
      const profile:any = await this.http.get(`${url}/profile`, {headers}).toPromise();
      return Promise.resolve(profile);
    }
    catch(error){
      return Promise.reject(error);
    }
  }

  public async updateUserProfile(user:User, payload: any): Promise<any>{
    const headers = {Authorization: `Bearer ${user.token}`, Accept: 'application/json', 'Content-Type': 'application/json'};
    try{
      const response:any = await this.http.post(`${this.baseUrl}/updatereg`, payload, {headers}).toPromise();
      return Promise.resolve(response);
    }
    catch(error){
      return Promise.reject(error);
    }
  }

  public async updateUserPin(user:User, payload: any): Promise<any>{
    const url = 'http://41.73.8.123/horizonaccess/legend/public/api/v3'; //'https://legendpay.ng/api/v3'; //Version 3 url
    const headers = {Authorization: `Bearer ${user.token}`, Accept: 'application/json', 'Content-Type': 'application/json'};
    try{
      const response:any = await this.http.post(`${url}/pin`, payload, {headers}).toPromise();
      return Promise.resolve(response);
    }
    catch(error){
      return Promise.reject(error);
    }
  }
}
