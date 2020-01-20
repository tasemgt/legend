import { Injectable } from '@angular/core';
import { Constants } from '../models/constants';
import { HttpClient } from '@angular/common/http';

import { AuthService } from './auth.service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  private baseUrl = Constants.baseUrl;

  constructor(private http: HttpClient) {}

  public async getTransactionRecords(user: User){
    const headers = {Authorization: `Bearer ${user.token}`, Accept: 'application/json', 'Content-Type': 'application/json'};
    try{
      const records = await this.http.get(`${this.baseUrl}/transaction`, {headers}).toPromise();
      return Promise.resolve(records);
    }
    catch(error){
      return Promise.reject(error);
    }
  }

  public async getUsageLogs(user: User){
    const headers = {Authorization: `Bearer ${user.token}`, Accept: 'application/json', 'Content-Type': 'application/json'};
    try{
      const usage = await this.http.get(`${this.baseUrl}/usage-log`, {headers}).toPromise();
      return Promise.resolve(usage);
    }
    catch(error){
      return Promise.reject(error);
    }
  }

  public async getFinancialLogs(user: User){
    const headers = {Authorization: `Bearer ${user.token}`, Accept: 'application/json', 'Content-Type': 'application/json'};
    try{
      const financial = await this.http.get(`${this.baseUrl}/check-list`, {headers}).toPromise();
      return Promise.resolve(financial);
    }
    catch(error){
      return Promise.reject(error);
    }
  }

  
}
