import { Component, OnInit, OnDestroy, ComponentRef } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { SelectMerchantPage } from '../../modals/purchases/select-merchant/select-merchant.page';
import { SearchUserTransferPage } from '../../modals/transfer/search-user-transfer/search-user-transfer.page';
import { TopUpPage } from '../../modals/topups/top-up/top-up.page';

import { myEnterAnimation, myEnterAnimation2 } from 'src/app/animations/enter';
import { myLeaveAnimation, myLeaveAnimation2 } from 'src/app/animations/leave';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { WalletService } from 'src/app/services/wallet.service';
import { Balance } from 'src/app/models/wallet';
import { UtilService } from 'src/app/services/util.service';
import { Transaction } from 'src/app/models/transaction';
import { SeeAllPage } from '../../modals/transactions/see-all/see-all.page';
import { SelectServicePage } from '../../modals/payments/select-service/select-service.page';
import { BankTransferPage } from '../../modals/transfer/bank-transfer/bank-transfer.page';
import { BvnVerificationPage } from '../../modals/transfer/bvn-verification/bvn-verification.page';

import { ReceiptPage } from '../../modals/receipt/receipt.page';





@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit {

  private authSubscription: Subscription;
  private balanceSubscription: Subscription;

  public balance: Balance;
  public transactions: Transaction[];
  public showIosOnce: boolean;
  public showLoading: boolean;

  public listReload: boolean;



  constructor(
    private modalCtrl: ModalController,
    private authService: AuthService,
    private walletService: WalletService,
    private platform: Platform,
    private utilService: UtilService){
    // private pdfGenerator: PDFGenerator) { 

      this.showIosOnce = true;
      this.listReload = false;
    }

  ngOnInit() {

    this.authSubscription = this.authService.getAuthStateSubject().subscribe((state) =>{
      if(state){
        this.getBalance();
        this.getTransactions(false);
      }
      else{
        this.balance = null;
        this.transactions = [];
      }
    });

    // Subscribe to balance changes
    this.balanceSubscription = this.walletService.balanceState.subscribe((fetchBalance) =>{
      if(fetchBalance){
        this.getBalance();
        this.getTransactions(false);
      }
    });
  }



  private async getBalance(){
    try{
      let balance: Balance;
      balance = await this.walletService.getBalance();
      this.balance = balance;
      console.log(balance);
    }
    catch(err){
      if(err.status === 0){
        setTimeout(() =>{
          if(this.showIosOnce){
            this.utilService.showToast('Check network connectivity', 1000, 'danger');
            this.showIosOnce = false; 
          }
          this.getBalance(); // Call get balance again after 15secs;
        }, 2000);
      }
    }
  }


  public async getTransactions(reload: boolean){

    reload ? this.listReload = true: this.listReload = false;

    this.showLoading = true;
    this.walletService.getTransactions().then((trans) =>{
      this.showLoading = false;
      this.listReload = false;
      this.transactions = trans;
    })
    .catch((err) =>{
      if(err.status === 0){
        setTimeout(() =>{
          this.getTransactions(false); // Call get balance again after 10secs;
        }, 5000);
      }
    });
  }


  public async getTransferOptions(){
    const buttons = [
      {
        text: 'Transfer Funds',
        handler: () =>{
          console.log(this);
          this.openSearchUserForTransferModal();
        }
      },
      {
        text: 'Bank Transfer',
        handler: () => {
          this.openbankTransferModal();
        }
      }
    ];

    if(this.balance && this.balance.can_transfer === 'YES'){
      return await this.utilService.presentActionSheet(buttons); 
    }
    this.openSearchUserForTransferModal();
  }

  //Modals for purchases
  public async openSearchMerchantModal(){
    // this.router.navigateByUrl('/edit-profile');
    const modal = await this.modalCtrl.create({
      component: SelectMerchantPage,
      enterAnimation: myEnterAnimation,
      leaveAnimation: myLeaveAnimation,
      componentProps: {'balance': this.balance}
    });
    await modal.present();
  }


  //Modals for transfer
  public async openSearchUserForTransferModal(){
    const modal = await this.modalCtrl.create({
      component: SearchUserTransferPage,
      enterAnimation: myEnterAnimation,
      leaveAnimation: myLeaveAnimation
    });
    await modal.present();
  }

  public async openbankTransferModal(){
    let component: any;
    if(this.balance && this.balance.bvn_verified === 'YES'){
      component = BankTransferPage;
    }
    else{
      component = BvnVerificationPage;
    }
    const modal = await this.modalCtrl.create({
      component,
      enterAnimation: myEnterAnimation,
      leaveAnimation: myLeaveAnimation,
      componentProps: {'bankTransfer': true}
    });
    await modal.present();
  }

  //Modals for TopUp / Account funding
  public async openTopUpModal(){
    const modal = await this.modalCtrl.create({
      component: TopUpPage,
      enterAnimation: myEnterAnimation,
      leaveAnimation: myLeaveAnimation
    });
    await modal.present();
  }

  //Modals for payment
  public async openSelectServiceModal(){
    const modal = await this.modalCtrl.create({
      component: SelectServicePage,
      enterAnimation: myEnterAnimation,
      leaveAnimation: myLeaveAnimation,
    });
    await modal.present();
  }

  //Modal for see all transactions
  public async openSeeAllTransactionsModal(){
    const modal = await this.modalCtrl.create({
      component: SeeAllPage,
      enterAnimation: myEnterAnimation2,
      // leaveAnimation: myLeaveAnimation2,
      componentProps: {transactions:this.transactions}
    });
    await modal.present();
  }

  //Modal for receipt
  public async openReceiptModal(){
    const modal = await this.modalCtrl.create({
      component: ReceiptPage,
      componentProps: {}
    });
    await modal.present();
  }

  public formatWithCommas(num: any){
    if(!num){
      return;
    }
    return this.utilService.numberWithCommas(num);
  }

  public doRefresh(event): void{
    this.getBalance();
    this.getTransactions(false);

    setTimeout(() =>{
      event.target.complete();
    }, 1000)
  }

  public generateReceipt(transaction: Transaction){
    this.utilService.generateReceipt(transaction);
  }

}
