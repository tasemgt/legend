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
  
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';

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
    
    console.log(form.value.username, form.value.password);

    this.utilService.presentLoading('Logging you in')
      .then(() =>{
        this.authService.login(form.value.username, form.value.password, false)
          .then((response: any) =>{
            this.loadingCtrl.dismiss();
            if(response.code === 418){
              this.utilService.showToast(response.message, 3000, 'danger');
            }
          })
          .catch((error:HttpErrorResponse) => {
            console.log(error);
            this.loadingCtrl.dismiss();
            if(error.status === 0){
              console.log('No network')
              this.utilService.showToast('Ooops! something went wrong, please check your connection and try again.', 3000, 'danger');        
            }   
            else{
              this.loadingCtrl.dismiss();
              switch(error.status){
                case(401):
                  this.utilService.showToast('Invalid Login Credentials', 3000, 'danger');
                  break;
                case(500):
                  this.utilService.showToast('Cannot connect to server at the moment, please try again later', 3000, 'danger');
                  break;
              }
            }
          });
      });
  }

  public hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

}
