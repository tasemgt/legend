import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Platform, LoadingController } from '@ionic/angular';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject } from 'rxjs';
import { Constants } from '../models/constants';
import { User, UserCred, UserAddress } from '../models/user';
import { UtilService } from './util.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = Constants.baseUrl;
  private authUser = Constants.authUser;
  
  public authState: BehaviorSubject<boolean> = new BehaviorSubject(null);

  // Http Options
  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(
    private platform: Platform, 
    private storage: Storage,
    private http: HttpClient,
    private util: UtilService,
    private loadingCtrl: LoadingController) {
    this.platform.ready().then(() =>{
      this.checkToken(); // Check auth state on every app instantiation
    });
  }

  public checkToken(): void {
    this.storage.get(this.authUser).then(res =>{
      res ? this.authState.next(true): this.authState.next(false);
    });
  }

  // NB Automatic logout happens in
  // bundle-types, renew bundle, edit profile, fund wallet, 

  public checkTokenExpiry(user: User): boolean{
    const currentDate = new Date();
    const expDate =  new Date(user.expiry); // new Date("2020-03-05T15:27:00.000000Z");

    if(currentDate >= expDate){
      // Log user out
      this.logout();
      this.util.presentAlert('Session Expired. <br/><br/>Login to continue');
      return true;
    }
    return false;
  }

  public submitUserBasicInfo(userCred: UserCred) : Promise<any>{
    const headers = {Accept: 'application/json', 'Content-Type': 'application/json'};
    return this.http.post(`${this.baseUrl}/sign-up`, userCred, {headers})
      .toPromise()
      .then((resp) =>{
        return Promise.resolve(resp);
      })
      .catch((error: HttpErrorResponse) =>{
          return Promise.reject(error);
        });
  }

  public submitUserAddressInfo(userAddress: UserAddress, userToken: string) : Promise<any>{

    const headers = {Authorization: `Bearer ${userToken}`, Accept: 'application/json', 'Content-Type': 'application/json'};
    return this.http.post(`${this.baseUrl}/update-info`, userAddress, {headers})
      .toPromise()
      .then((resp) =>{
        return Promise.resolve(resp);
      })
      .catch((error: HttpErrorResponse) =>{
          return Promise.reject(error);
        });
  }

  public login(username: string, password: string) : Promise<User>{
    let usr: User;
    const headers = {Accept: 'application/json', 'Content-Type': 'application/json'};
    return this.http.post(`${this.baseUrl}/login`, {username, password}, {headers})
      .toPromise()
      .then((response: any) =>{
        console.log(response);
        if(response.code === 418){
          return Promise.resolve(response); // Invalid login here, but pass along to be handled by page
        }
        usr = response;
        return this.storage.set(this.authUser, response)
          .then(() =>{
            this.authState.next(true);
            return Promise.resolve(usr);
          });
      })
      .catch((error: HttpErrorResponse) =>{
          return Promise.reject(error);
        });
  }

  public forgotPassword(email: string){
    return this.http.post(`${this.baseUrl}/providerauth/password`, {email})
      .toPromise()
      .then(res =>{
        return Promise.resolve(res);
      })
      .catch((err: HttpErrorResponse) =>{
        return Promise.reject(err); 
      });
  }

  public logout(user?: User) {
    if(user){  // If user initiated logout, expire token and clear from storage
      const headers = {Authorization: `Bearer ${user.token}`, Accept: 'application/json', 'Content-Type': 'application/json'};
      return this.http.get(`${this.baseUrl}/logout`, {headers}).toPromise()
        .then((resp: {code:number; message:string}) =>{
          this.loadingCtrl.dismiss();
          if(resp.code === 100){
            this.clearUserToken();
            return Promise.resolve(resp);
          }
          else if(resp.code === 418){
            return Promise.reject(resp);
          }
        })
        .catch((err) =>{
          this.loadingCtrl.dismiss();
          return Promise.reject(err);
        });
    }
    this.clearUserToken();  //Simply clear token if user token expires and app needs to logout
  }

  public getUser(): Promise<User>{
    return this.storage.get(this.authUser).then((user) =>{
      if(user){
        return Promise.resolve(user);
      } 
      return Promise.reject('No user in storage');
    });
  }

  public isAuthenticated() {
    return this.authState.value;
  }

  private clearUserToken(){
    this.storage.clear().then(() => {
      this.authState.next(false);
    });
  }

  public getAuthStateSubject(){
    return this.authState;
  }
}
