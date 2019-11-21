import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject } from 'rxjs';
import { Constants } from '../models/constants';
import { User } from '../models/user';


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

  public login(email: string, password: string) : Promise<User>{
    const headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');

    let usr: User;

    return this.http.post(`${this.baseUrl}/email-login`, {email, password}, this.httpOptions)
      .toPromise()
      .then((user: User) =>{
        if(user){
          usr = user;
          return this.storage.set(this.authUser, user);
        }
      })
      .then(() =>{
        this.authState.next(true);
        return Promise.resolve(usr);
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
    return this.storage.remove(this.authUser).then(() => {
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
}
