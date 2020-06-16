import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { AuthService } from './auth.service';
import { UtilService } from './util.service';
import { Observable } from 'rxjs';

export class AuthInterceptorService implements HttpInterceptor{

  private counter = 0; // To track that logout happens once for multiple calls

  constructor(
    private authService: AuthService,
    private utilService: UtilService){}

  intercept(req: HttpRequest<any>, next: HttpHandler){
    if(!(req.url.includes('/api/v2/login') || req.url.includes('/api/v2/sign-up') || req.url.includes('/api/v2/update-info'))){
      let user = this.authService.user; 
      if(this.authService.checkTokenExpiry(user)){
        if(this.counter < 1 ){ // To prevent multiple logouts from a particular page
          this.authService.logout();
          this.utilService.presentAlert('Session Expired. <br/><br/>Kindly <strong>Login</strong> to continue');
          this.counter++;
        }
        return new Observable<HttpEvent<any>>((observer) =>{
          observer.next();
        });
      }
      else{
        console.log('Token still valid');
        return next.handle(req);
      }
    }
    else{
      console.log('Req is a login or signup');
      this.counter = 0; // Reset counter
      return next.handle(req); //Request is a login or signup
    }
  }

}