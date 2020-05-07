import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MerchantService {

  constructor(
    private http: HttpClient,
    private authService: AuthService) { }



  public getMerchants(fromModal:boolean, url?: string): Promise<any>{
    const baseUrl = 'http://41.73.8.123/horizonaccess/legend/public/api'
    return this.authService.getUser()
      .then(user => {
        const headers = {Authorization: `Bearer ${user.token}`, 'Content-Type': 'application/json'};
        return url && fromModal? this.http.get(url, {headers}).toPromise(): this.http.get(`${baseUrl}/merchants`, {headers}).toPromise();
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
