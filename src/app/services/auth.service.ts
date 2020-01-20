import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject } from 'rxjs';
import { Constants } from '../models/constants';
import { User, UserCred } from '../models/user';
import { HTTP } from '@ionic-native/http/ngx';


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
    private http2: HTTP,
    private http: HttpClient) {
    this.platform.ready().then(() =>{
      this.checkToken(); // Check auth state on every app instantiation
    });
  }

  public checkToken(): void {
    this.storage.get(this.authUser).then(res =>{
      res ? this.authState.next(true): this.authState.next(false);
    });
  }

  public register(userCred: UserCred) : Promise<any>{
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

  public logout() {
    return this.storage.clear().then(() => {
      this.authState.next(false);
    });
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

  public getAuthStateSubject(){
    return this.authState;
  }
}
