import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController, NavParams, LoadingController } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';
import { WalletService } from 'src/app/services/wallet.service';
import { PaymentService } from 'src/app/services/payment.service';
import { Router } from '@angular/router';
import { Subscription, BehaviorSubject } from 'rxjs';


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
    private router: Router,
    private navParams: NavParams,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private paymentService: PaymentService,
    private walletService: WalletService,
    private utilService: UtilService) {

      this.email = this.navParams.get('email');
      this.paymentType = this.navParams.get('paymentType');
  }

  ngOnInit() {
    this.fundWalletForm.resetForm(); //Reset form when modal loads
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
        this.responseSubscription = this.paymentService.getResponseSubject()
          .subscribe((response) =>{
            if(!response){
              this.loadingCtrl.dismiss(); //Happens when inapp browser closes without payment
              return;
            }
            setTimeout(() =>{  // Just to create some load effect before completing
              this.loadingCtrl.dismiss();
              if(JSON.parse(response).code === 100){
                  this.utilService.showToast(`\u20A6${amount}, has been successfully added to your wallet`, 3000, 'secondary');
                  this.walletService.balanceState.next(true); // Inform home page that balance needs to be updated..
              }
              else{
                this.utilService.showToast(`Your wallet could not be funded at this time`, 3000, 'danger');
              }
              this.closeModal();
              this.fundWalletForm.resetForm();
              //this.router.navigateByUrl('/tabs/home');
            }, 1000);
          }
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
