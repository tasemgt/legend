import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController, NavParams, LoadingController, Platform } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';
import { WalletService } from 'src/app/services/wallet.service';
import { TopUpService } from 'src/app/services/top-up.service';
import { Router } from '@angular/router';
import { Subscription, BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Constants } from 'src/app/models/constants';
import { Flutterwave, InlinePaymentOptions, PaymentSuccessResponse } from 'flutterwave-angular-v3';
import { Profile, User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';


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

  public publicKey = Constants.flutterwavePublicKey;
  public paymentData: InlinePaymentOptions;

  public user: User;

  constructor(
    private platform: Platform,
    private navParams: NavParams,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private auth: AuthService,
    private userService: UserService,
    private flutterwave: Flutterwave,
    private paymentService: TopUpService,
    private walletService: WalletService,
    private utilService: UtilService) {

      this.email = this.navParams.get('email');
      this.paymentType = this.navParams.get('paymentType').toLowerCase();
  }

  async ngOnInit() {
    this.fundWalletForm.resetForm(); //Reset form when modal loads
    this.user = await this.userService.updateUserNameInStorage('fund');
    this.loadingCtrl.dismiss();
  }

  //Check for token expiry and close...
  ionViewDidEnter(){
    setTimeout(async () =>{
      const user = await this.auth.getUser();
      this.auth.checkTokenExpiry(user);
    }, 200);
  }

  // Function to make calls to pop up payment on InApp browser
  public fundWallet(form: NgForm){
    if(form.invalid){
      this.utilService.showToast('Please enter a valid amount.', 2000, 'danger');
      return;
    }

    let _amount = form.value.amount;

    this.utilService.presentLoading('Funding your wallet.')
      .then(() =>{

        let amount = _amount.replace(/,/g, "");
        // this.handleFundWallet(amount);
        this.handleFundWalletV2(amount);
      });
  }

  //Payments using iab
  private handleFundWallet(amount: string){

    this.paymentService.makePayment(amount)// Calls the payment service
      .then((err:any) =>{
        if(err){
          this.utilService.showToast(`${err.message}`, 3000, 'danger');
          this.loadingCtrl.dismiss();
        }
      });

    //Listen to iab events..
    this.responseSubscription = this.paymentService.getResponseSubject()
      .subscribe((response: string) =>{
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
            this.utilService.showToast(message, 3000, 'danger');
          }
          else{
            this.utilService.showToast(`Your payment could not be processed. Please try again.`, 3000, 'danger');
          } 
        }
      }
    );
  }

  //v2 of payments using flw-sdk
  private handleFundWalletV2(amount: string){
    const customerDetails = { name: `${this.user.firstName} ${this.user.lastName}`, email: this.user.email, phone_number: this.user.phone};
    const customizations = {title: 'Wallet Topup'};
    const  meta = {'metaname': 'Legend Pay', 'metavalue': `${this.user.username}`, 'email': this.user.email};

    this.paymentData = {
      public_key: this.publicKey,
      tx_ref: this.generateReference(),
      amount: Number(amount),
      currency: 'NGN',
      payment_options: 'card,banktransfer,ussd,payattitude,barter,qr,paga',
      redirect_url: '',
      meta,
      customer: customerDetails,
      customizations,
      callback: this.makePaymentCallback,
      onclose: this.closedPaymentModal,
      callbackContext: this
    }
    this.makePayment();
    setTimeout(() => this.loadingCtrl.dismiss(), 500);
  }

  private makePayment(){
    this.flutterwave.inlinePay(this.paymentData);
  }
  
  private async makePaymentCallback(response: PaymentSuccessResponse): Promise<void> {
    console.log("Payment callback", response);
    this.flutterwave.closePaymentModal(1);
    await this.utilService.presentLoading('');
    this.vendTransaction(response.transaction_id);
  }

  private closedPaymentModal(): void {
    console.log('payment is closed');
  }

  private generateReference(): string {
    const prefix = this.platform.is('ios') ? 'LPI' : 'LPA';
    const date = new Date();
    return `${prefix}${date.getTime().toString()}`;
  }

  private async vendTransaction(transactionId: number){
    const resp:any = await this.paymentService.makePaymentV2(transactionId);
    this.loadingCtrl.dismiss();
    if(resp.code === 418){
      console.log(resp);
      this.utilService.showToast(resp.message, 3000, 'danger');
    }
    else{
      //Payment successfull
      this.utilService.showToast(resp.message, 3000, 'success');
      this.walletService.balanceState.next(true);
      this.closeModal();
    }
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
