import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Constants } from '../models/constants';

@Injectable({
  providedIn: 'root'
})
export class MerchantService {

  private baseUrl = Constants.baseUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService) { }


    public getMerchant(searchString: string): Promise<any>{
      return this.authService.getUser()
        .then(user => {
          const headers = {Authorization: `Bearer ${user.token}`, 'Content-Type': 'application/json'};
          return this.http.get(`${this.baseUrl}/merchant/${searchString}`, {headers}).toPromise();
        })
        .then(resp => {
          return Promise.resolve(resp);
        })
        .catch(err => {
          console.log(err)
          return Promise.reject(err);
        });
    }



  public getMerchants(aRefresher:boolean, url?: string): Promise<any>{
    return this.authService.getUser()
      .then(user => {
        const headers = {Authorization: `Bearer ${user.token}`, 'Content-Type': 'application/json'};
        return url && aRefresher? this.http.get(url, {headers}).toPromise(): this.http.get(`${this.baseUrl}/merchants`, {headers}).toPromise();
      })
      .then(resp => {
        return Promise.resolve(resp);
      })
      .catch(err => {
        console.log(err)
        return Promise.reject(err);
      });
  }


  public getSearchedMerchants(aRefresher:boolean, searchWord:string, url?: string){
    return this.authService.getUser()
      .then(user => {
        const headers = {Authorization: `Bearer ${user.token}`, 'Content-Type': 'application/json'};
        return url && aRefresher? this.http.get(url, {headers}).toPromise(): this.http.get(`${this.baseUrl}/merchant/search/${searchWord}`, {headers}).toPromise();
      })
      .then(resp => {
        return Promise.resolve(resp);
      })
      .catch(err => {
        console.log(err)
        return Promise.reject(err);
      });
  }

  public getProducts(merchantID: number): Promise<any>{
    return this.authService.getUser()
      .then(user => {
        const headers = {Authorization: `Bearer ${user.token}`, 'Content-Type': 'application/json'};
        return this.http.get(`${this.baseUrl}/products/${merchantID}`, {headers}).toPromise();
      })
      .then(resp => {
        return Promise.resolve(resp);
      })
      .catch(err => {
        console.log(err)
        return Promise.reject(err);
      });
  }

  public directPayMerchant(merchantID: string, amount:string): Promise<any>{
    return this.authService.getUser()
      .then(user => {
        const headers = {Authorization: `Bearer ${user.token}`, 'Content-Type': 'application/json'};
        return this.http.post(`${this.baseUrl}/pay-merchant`, {id:merchantID, amount}, {headers}).toPromise();
      })
      .then(resp => {
        return Promise.resolve(resp);
      })
      .catch(err => {
        console.log(err)
        return Promise.reject(err);
      });
  }

  public buyProduct(productID: string): Promise<any>{
    return this.authService.getUser()
      .then(user => {
        const headers = {Authorization: `Bearer ${user.token}`, 'Content-Type': 'application/json'};
        return this.http.post(`${this.baseUrl}/buy-product`, {id:productID}, {headers}).toPromise();
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
