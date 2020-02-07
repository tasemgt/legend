import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UtilService } from 'src/app/services/util.service';
import { UserCred } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  @ViewChild('loginForm', null) loginForm: NgForm;

  constructor(
    private router: Router,
    private loadingCtrl: LoadingController,
    private utilService: UtilService, 
    private authService: AuthService) { }

    ngOnInit() {
      this.loginForm.resetForm();
    }

    ionViewWillLeave(){
      this.loginForm.resetForm();
    }

  register(form: NgForm){
    if(form.invalid){
      this.utilService.showToast('Form cannot contain empty fields.', 2000, 'danger');
      return;
    }
    if(!this.utilService.validateEmail(form.value.email)){
      this.utilService.showToast('Please enter a valid email.', 2000, 'danger');
      return;
    }

    if(form.value.password !== form.value.password_confirmation){
      this.utilService.showToast('Passwords do not match', 2000, 'danger');
      return;
    }
    console.log(form.value.email, form.value.password, form.value.password_confirmation, this.utilService.transformPhone(form.value.phone), form.value.username, form.value.firstName, form.value.lastName);

    const userAccount: UserCred = {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      phone: this.utilService.transformPhone(form.value.phone),
      username: form.value.username,
      password: form.value.password,
      password_confirmation: form.value.password_confirmation
    }
    this.utilService.presentLoading('Creating your account');
    console.log(userAccount);
    this.authService.register(userAccount)
      .then((resp) =>{
        this.loadingCtrl.dismiss();
        this.utilService.showToast(`Hi, ${userAccount.firstName}, your Legend wallet has successfully been created`, 4000, 'success');
        this.router.navigateByUrl('/login');
      })
      .catch((error:HttpErrorResponse) => {
        console.log(error);
        if(error.status === 0){
          setTimeout(()=>{
            this.loadingCtrl.dismiss();
            console.log('No network')
            this.utilService.showToast('Ooops! something went wrong, please check your connection and try again.', 3000, 'danger');
          },2000);
        }   
        else{
          switch(error.status){
            case(401):
              this.loadingCtrl.dismiss();
              this.utilService.showToast('Cannot create your legend wallet at the moment, please try again later', 3000, 'danger');
              break;
            case(422):
              this.loadingCtrl.dismiss();
              let m = error.error.errors.username[0] || 'Check that you inputed correct information';
              this.utilService.showToast(m, 3000, 'danger');
              break;
            case(500):
              this.loadingCtrl.dismiss();
              this.utilService.showToast('Cannot connect to server at the moment, please try again later', 3000, 'danger');
              break;
          }
        }
      });
  }

}
