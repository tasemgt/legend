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



  public getMerchants(aRefresher:boolean, url?: string): Promise<any>{
    const baseUrl = 'http://41.73.8.123/horizonaccess/legend/public/api'

    return this.authService.getUser()
      .then(user => {
        const headers = {Authorization: `Bearer ${user.token}`, 'Content-Type': 'application/json'};
        return url && aRefresher? this.http.get(url, {headers}).toPromise(): this.http.get(`${baseUrl}/merchants`, {headers}).toPromise();
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
    const baseUrl = 'http://41.73.8.123/horizonaccess/legend/public/api'

    return this.authService.getUser()
      .then(user => {
        const headers = {Authorization: `Bearer ${user.token}`, 'Content-Type': 'application/json'};
        return url && aRefresher? this.http.get(url, {headers}).toPromise(): this.http.get(`${baseUrl}/merchant/search/${searchWord}`, {headers}).toPromise();
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
    const baseUrl = 'http://41.73.8.123/horizonaccess/legend/public/api'

    return this.authService.getUser()
      .then(user => {
        const headers = {Authorization: `Bearer ${user.token}`, 'Content-Type': 'application/json'};
        return this.http.get(`${baseUrl}/products/${merchantID}`, {headers}).toPromise();
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
    const baseUrl = 'http://41.73.8.123/horizonaccess/legend/public/api'

    return this.authService.getUser()
      .then(user => {
        const headers = {Authorization: `Bearer ${user.token}`, 'Content-Type': 'application/json'};
        return this.http.post(`${baseUrl}/pay-merchant`, {id:merchantID, amount}, {headers}).toPromise();
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
    const baseUrl = 'http://41.73.8.123/horizonaccess/legend/public/api'

    return this.authService.getUser()
      .then(user => {
        const headers = {Authorization: `Bearer ${user.token}`, 'Content-Type': 'application/json'};
        return this.http.post(`${baseUrl}/buy-product`, {id:productID}, {headers}).toPromise();
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
