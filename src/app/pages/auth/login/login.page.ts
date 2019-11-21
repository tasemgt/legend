import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from 'src/app/services/auth.service';
import { UtilService } from 'src/app/services/util.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    private authService: AuthService,
    private utilService: UtilService) { }

  ngOnInit() {
  }

  public async login(form: NgForm){
    if(form.invalid){
      this.utilService.showToast('Login form cannot be empty.', 2000, 'danger');
      return;
    }
    
    if(!this.utilService.validateEmail(form.value.email)){
      this.utilService.showToast('Please enter a valid email.', 2000, 'danger');
      return;
    }
    console.log(form.value.email, form.value.password);
    this.utilService.presentLoading('Logging you in');
    this.authService.login(form.value.email, form.value.password)
      .then(() =>{
        this.utilService.dismissLoading();
      })
      .catch((error) =>{
        this.utilService.dismissLoading();
        console.log(error);
        switch(error.status){
          case(0):
            this.utilService.showToast('Cannot connect to server', 3000, 'danger');
            break;
          case(401):
            this.utilService.showToast('Invalid Login Credentials', 3000, 'danger');
            break;
          case(500):
            this.utilService.showToast('Server connection error', 3000, 'danger');
            break;
        }
      });

  }

}
