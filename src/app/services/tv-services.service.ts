import { Injectable } from '@angular/core';
import { Constants } from '../models/constants';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TvServicesService {

  private baseUrl = Constants.baseUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}


  public SubscribeToTvUpdate(payload: any): Promise<any>{
    return this.authService.getUser()
     .then(user => {
       const headers = {Authorization: `Bearer ${user.token}`, 'Content-Type': 'application/json'};
       return this.http.post(`${this.baseUrl}/subscribe-tv`, payload, {headers}).toPromise()
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
