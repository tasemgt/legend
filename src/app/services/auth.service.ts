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

  public user: User;
  
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

    this.getUser().then(() =>{}).catch((err) => console.log(err)); //User object for use, universally
  }

  public checkToken(): void {
    this.storage.get(this.authUser).then(res =>{
      res ? this.authState.next(true): this.authState.next(false);
    });
  }

  //Check if token has expired
  public checkTokenExpiry(user: User): boolean{
    const currentDate = new Date();
    const expDate =  new Date(user.expiry); //new Date("2020-06-21T11:52:00.000000Z"); //NB Date is 1hr behind actual West Africa time
    return currentDate >= expDate ? true : false;
  }

  //Signup stage 1, creating basic info
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

  //Signup stage 2, creating address info
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

  //Login user from Login page or from registration page to get token
  public login(username: string, password: string, fromRegstr: boolean) : Promise<User>{
    let usr: User;
    const headers = {Accept: 'application/json', 'Content-Type': 'application/json'};
    return this.http.post(`${this.baseUrl}/login`, {username, password}, {headers})
      .toPromise()
      .then((response: any) =>{
        if(response.code === 418){
          return Promise.resolve(response); // Invalid login here, but pass along to be handled by page
        }
        response['username'] = username; //Add username to the authUser object for future reference
        usr = response;
        if(!fromRegstr){
          return this.storage.set(this.authUser, response)
            .then(() =>{
              this.authState.next(true);
              return Promise.resolve(usr);
            });
        }
        else{
          return Promise.resolve(usr); //Only return the user object if api is called from register page
        }
      })
      .catch((error: HttpErrorResponse) =>{
          return Promise.reject(error);
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
            this.util.showToast(resp.message, 2000, 'danger');
            return Promise.reject(resp);
          }
        })
        .catch((err) =>{
          this.loadingCtrl.dismiss();
          this.util.showToast('Please check your network settings', 2000, 'danger');
          return Promise.reject(err);
        });
    }
    this.loadingCtrl.dismiss(); // For post routes that trigger loading
    this.clearUserToken();  //Simply clear token if user token expires and app needs to logout
  }

  //Get user form storage
  public getUser(): Promise<User>{
    return this.storage.get(this.authUser).then((user) =>{
      if(user){
        this.user = user;
        return Promise.resolve(user);
      } 
      return Promise.reject('No user in storage');
    });
  }

  //Return auth state value
  public isAuthenticated() {
    return this.authState.value;
  }

  //Clear token form storage
  private clearUserToken(){
    this.storage.clear().then(() => {
      this.authState.next(false);
    });
  }

  public async setUserToStorage(user: User){
    await this.storage.set(this.authUser, user);
  }

  public getAuthStateSubject(){
    return this.authState;
  }
}
