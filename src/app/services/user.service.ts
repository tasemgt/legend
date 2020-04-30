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
    const headers = {Authorization: `Bearer ${user.token}`, Accept: 'application/json', 'Content-Type': 'application/json'};
    try{
      const profile:any = await this.http.get(`${this.baseUrl}/profile`, {headers}).toPromise();
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
}
