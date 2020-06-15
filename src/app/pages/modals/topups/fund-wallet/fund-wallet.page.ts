import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController, NavParams, LoadingController } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';
import { WalletService } from 'src/app/services/wallet.service';
import { TopUpService } from 'src/app/services/top-up.service';
import { Router } from '@angular/router';
import { Subscription, BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-fund-wallet',
  templateUrl: './fund-wallet.page.html',
  styleUrls: ['./fund-wallet.page.scss'],
})
export class FundWalletPage implements OnInit, OnDestroy {

  @ViewChild('fundForm', null) fundWalletForm: NgForm;
  public email: string;
  public amount = "";
  public paymentType = "";

  public _amount: string;

  public responseSubscription: Subscription;

  constructor(
    private navParams: NavParams,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private auth: AuthService,
    private paymentService: TopUpService,
    private walletService: WalletService,
    private utilService: UtilService) {

      this.email = this.navParams.get('email');
      this.paymentType = this.navParams.get('paymentType').toLowerCase();
  }

  ngOnInit() {
    this.fundWalletForm.resetForm(); //Reset form when modal loads
  }

  ionViewDidEnter(){
    setTimeout(async () =>{
      const user = await this.auth.getUser();
      this.auth.checkTokenExpiry(user);
    }, 200);
  }

  // Function to make calls to pop up payment on InAPp browser
  public fundWallet(form: NgForm){
    if(form.invalid){
      this.utilService.showToast('Please enter a valid amount.', 2000, 'danger');
      return;
    }

    let _amount = form.value.amount;

    this.utilService.presentLoading('Funding your wallet.')
      .then(() =>{

        let amount = _amount.replace(/,/g, "");

        this.paymentService.makePayment(amount)// Calls the payment service
          .then((err:any) =>{
            if(err){
              this.utilService.showToast(`${err.message}`, 3000, 'danger');
              this.loadingCtrl.dismiss();
            }
          });

        this.responseSubscription = this.paymentService.getResponseSubject()
          .subscribe((response: string) =>{
            console.log("RESP ", response);
            if(!response){
              //Happens when inapp browser closes without payment
              console.log('no response', response);
              return;
            }
            else{
              let status = response.substring(0, response.indexOf('-'));
              let message = response.substring(response.indexOf('-')+1);
              if(status === 'success'){
                  this.utilService.showToast(message, 3000, 'success');
                  this.walletService.balanceState.next(true); // Inform subscribed pages that balance needs to be updated..
                  this.closeModal();
              }
              else if(status === 'failure'){
                this.utilService.showToast(message, 3000, 'success');
              }
              else{
                this.utilService.showToast(`Your payment could not be processed. Please try again.`, 3000, 'danger');
              }  
            }
          }
        );
      });
  }

  public closeModal(){
    this.modalCtrl.dismiss();
  }

  public refreshModel(): void{
    if(this._amount){
      this._amount = this.utilService.numberWithCommas(this._amount);
    }
  }

  ngOnDestroy(){
    if(this.responseSubscription){
      this.responseSubscription.unsubscribe();
    }
  }
}
