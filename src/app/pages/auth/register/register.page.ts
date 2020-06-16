import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UtilService } from 'src/app/services/util.service';
import { UserCred, UserAddress } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingController, IonSlides } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  @ViewChild('basicForm', null) basicForm: NgForm;
  @ViewChild('addressForm', null) addressForm: NgForm;
  @ViewChild('slides', {static:false}) slides: IonSlides;

  public userBasicInfo: UserCred;
  public userAddressInfo: UserAddress;

  public accountCreationState: number;

  public slideOpts = {
    initialSlide: 0,
    speed: 400
  };

  constructor(
    private router: Router,
    private loadingCtrl: LoadingController,
    private utilService: UtilService, 
    private authService: AuthService) { }

    ngOnInit() {
      this.basicForm.resetForm();
      this.addressForm.resetForm();
    }

    ionViewWillLeave(){
      // this.addressForm.resetForm();
      // this.basicForm.resetForm();
    }

    //Prevents slide to next by swiping
    ionViewWillEnter(){
      this.slides.lockSwipes(true);
    }


  // Slides Handlers...
  public nextSlide(){
    this.slides.lockSwipes(false);
    this.slides.slideNext(500, false);
    this.slides.lockSwipes(true);
  }

  public previousSlide(){
    this.slides.lockSwipes(false);
    this.slides.slidePrev(500, false);
    this.slides.lockSwipes(true);
  }


  // After basic info entered
  public proceedToAddress(form: NgForm): void{

    this.accountCreationState = 0;

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

    this.userBasicInfo = {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      phone: this.utilService.transformPhone(form.value.phone),
      username: form.value.username,
      password: form.value.password,
      password_confirmation: form.value.password_confirmation,
      ref: form.value.ref
    };

    this.nextSlide();
  }

  //Signup without address info
  public skipAddress(): void{
    this.utilService.presentAlertConfirm('Skip Address Info', 
    `You can still update your address information from your profile page.
    <br/><br/> <strong>Proceed</strong>?`, () =>{
      this.doSignup(false);
    }, 'Cancel', 'Yes');
  }

  //Finish registration with address info
  public finishRegistration(form: NgForm): void{
    if(form.invalid){
      this.utilService.showToast('Form cannot contain empty fields.', 2000, 'danger');
      return;
    }

    this.userAddressInfo = {
      street: form.value.street,
      streetname: form.value.streetname,
      city: form.value.city
    }

    this.doSignup(true);
  }

  //Signup method to send info to server
  private doSignup(withAddress: boolean): void{
    this.utilService.presentLoading('Creating your account')
      .then(() =>{
        let successRespMessage = '';
        this.authService.submitUserBasicInfo(this.userBasicInfo)
          .then((resp) =>{ 
            this.accountCreationState = 1; //After basic info
            if(!withAddress){
              return resp;
            }
            //Quickly login to get a token to use for address submission.
            successRespMessage = resp.message; //Save for use after address add;
            return this.authService.login(this.userBasicInfo.username, this.userBasicInfo.password, true);
          })
          .then((resp) =>{
            if(withAddress){ //Calls submit address info function if user fills it
              this.accountCreationState = 2; //After address info
              return this.authService.submitUserAddressInfo(this.userAddressInfo, resp.token);
            }
            return resp;
          })
          .then((resp) =>{
            this.loadingCtrl.dismiss();
            withAddress ? resp.message = successRespMessage: '';
            if(resp.code === 100){
              this.utilService.showToast(resp.message, 4000, 'success');
              this.router.navigateByUrl('/login');
            }
            if(resp.code === 418){
              this.utilService.showToast(resp.message, 3000, 'danger');
            }
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
                  let message = 'Cannot create your legend wallet at the moment, please try again later';
                  if(this.accountCreationState >= 1){
                    message = 'Wallet created but address info not stored. You can update your address details in your profile section';
                  }
                  this.utilService.showToast(message, 3500, 'danger');
                  break;
                case(422):
                  this.loadingCtrl.dismiss();
                  let m = error.error.errors.username[0] || 'Check that you inputed correct information';
                  if(this.accountCreationState >= 1){
                    message = 'Wallet created but address info not stored. You can update your address details in your profile section';
                  }
                  this.utilService.showToast(m, 3500, 'danger');
                  break;
                case(500):
                  this.loadingCtrl.dismiss();
                  let mess = 'Cannot connect to server at the moment, please try again later';
                  if(this.accountCreationState >= 1){
                    mess = 'Wallet created but address info not stored. You can update your address details in your profile section';
                  }
                  this.utilService.showToast(mess, 3500, 'danger');
                  break;
              }
            }
          });

      });
  }


  public createdBasicInfo(){
    if(this.accountCreationState >= 1){
      return true;
    }
  }

}
