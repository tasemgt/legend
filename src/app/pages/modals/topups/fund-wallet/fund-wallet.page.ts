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

    const amount = form.value.amount;

    this.utilService.presentLoading('Funding your wallet.')
      .then(() =>{
        this.paymentService.makePayment(amount)// Calls the payment service
          .then((err:any) =>{
            if(err){
              this.utilService.showToast(`${err.message}`, 3000, 'danger');
              //this.loadingCtrl.dismiss();
            }
          });

        this.responseSubscription = this.paymentService.getResponseSubject()
          .subscribe((response) =>{
            console.log("RESP ", response);
            if(!response){
              //this.loadingCtrl.dismiss(); //Happens when inapp browser closes without payment
              return;
            }
            setTimeout(() =>{  // Just to create some load effect before completing
              //this.loadingCtrl.dismiss();
              if(response === 'Transaction Successful'){ //if(JSON.parse(response).code === 100){
                  this.utilService.showToast(`Success! Your payment of \u20A6${amount} is confirmed.`, 3000, 'success');
                  this.walletService.balanceState.next(true); // Inform subscribed pages that balance needs to be updated..
              }
              else{
                this.utilService.showToast(`Your payment could not be processed. Please try again.`, 3000, 'danger');
              }
              this.closeModal();
              this.fundWalletForm.resetForm();
              //this.router.navigateByUrl('/tabs/home');
            }, 1000);}
        );
      });
  }

  // public onModelChange(){
  //   this.amount = this.amount.replace(/\d(?=(?:\d{3})+$)/g, '$&,');
  // }

  public closeModal(){
    this.modalCtrl.dismiss();
  }

  ngOnDestroy(){
    if(this.responseSubscription){
      this.responseSubscription.unsubscribe();
    }
  }
}
