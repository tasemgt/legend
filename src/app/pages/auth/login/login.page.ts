import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from 'src/app/services/auth.service';
import { UtilService } from 'src/app/services/util.service';
import { HttpErrorResponse } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  @ViewChild('loginForm', null) loginForm: NgForm;

  constructor(
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private utilService: UtilService) { }

    ngOnInit() {
      this.loginForm.resetForm();
    }

  
    ionViewWillLeave(){
      console.log('Clearing');
      this.loginForm.resetForm();
    }
  

  public login(form: NgForm){
    if(form.invalid){
      this.utilService.showToast('Login form cannot be empty.', 2000, 'danger');
      return;
    }
    
    // if(!this.utilService.validateEmail(form.value.email)){
    //   this.utilService.showToast('Please enter a valid email.', 2000, 'danger');
    //   return;
    // }
    console.log(form.value.username, form.value.password);
    this.utilService.presentLoading('Logging you in');
    this.authService.login(form.value.username, form.value.password)
      .then((response: any) =>{
        this.utilService.dismissLoading();
        if(response.code === 418){
          this.utilService.showToast('Incorrect Username or Password', 3000, 'danger');
        }
      })
      .catch((error:HttpErrorResponse) => {
        console.log(error.status);
        if(error.status === 0){
          setTimeout(()=>{ // To give a little time for loadingCtrl to be available before dismissal
            this.loadingCtrl.dismiss();
            console.log('No network')
            this.utilService.showToast('Cannot connect to server, check network...', 3000, 'danger');
          },2000);
        }   
        else{
          switch(error.status){
            case(401):
              this.loadingCtrl.dismiss();
              this.utilService.showToast('Invalid Login Credentials', 3000, 'danger');
              break;
            case(500):
              this.loadingCtrl.dismiss();
              this.utilService.showToast('Server connection error', 3000, 'danger');
              break;
          }
        }
      });

  }

}
