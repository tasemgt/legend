import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { SelectMerchantPage } from '../../modals/payments/select-merchant/select-merchant.page';
import { SearchUserTransferPage } from '../../modals/transfer/search-user-transfer/search-user-transfer.page';
import { TopUpPage } from '../../modals/topups/top-up/top-up.page';

import { myEnterAnimation, myEnterAnimation2 } from 'src/app/animations/enter';
import { myLeaveAnimation, myLeaveAnimation2 } from 'src/app/animations/leave';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { WalletService } from 'src/app/services/wallet.service';
import { FundTransferService } from 'src/app/services/fund-transfer.service';
import { Balance } from 'src/app/models/wallet';
import { UtilService } from 'src/app/services/util.service';
import { SearchUserPage } from '../../modals/friend/search-user/search-user.page';
import { Transaction } from 'src/app/models/transaction';
import { SeeAllPage } from '../../modals/transactions/see-all/see-all.page';






@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit, OnDestroy {

  private authSubscription: Subscription;
  private balanceSubscription: Subscription;

  public balance: Balance;
  public transactions: Transaction[];
  public showIosOnce: boolean;

  constructor(
    private modalCtrl: ModalController,
    private authService: AuthService,
    private walletService: WalletService,
    private platform: Platform,
    private utilService: UtilService) { 

      this.showIosOnce = true;
    }

  ngOnInit() {

    this.authSubscription = this.authService.getAuthStateSubject().subscribe((state) =>{
      if(state){
        this.getBalance();
        this.getTransactions();
      }
      else{
        this.balance = null;
      }
    });

    // Subscribe to balance changes
    this.balanceSubscription = this.walletService.balanceState.subscribe((fetchBalance) =>{
      if(fetchBalance){
        this.getBalance();
      }
    });
  }



  private async getBalance(){
    try{
      this.balance = await this.walletService.getBalance();
    }
    catch(err){
      if(err.status === 0){
        console.log("calling again")
        setTimeout(() =>{
          if(this.platform.is('android') || (this.platform.is('ios') && this.showIosOnce)){
            this.utilService.showToast('Check network connectivity', 1000, 'danger');
            this.showIosOnce = false; 
          }
          this.getBalance(); // Call get balance again after 15secs;
        }, 10000);
      }
    }
  }


  private async getTransactions(){
    //let transactions: Transaction[] = [];

    this.walletService.getTransactions().then((trans) =>{
      // Object.values(trans).map(function(value: Transaction) {
      //   transactions.push(value)
      // });
       
      this.transactions = trans;
    })
    .catch((err) =>{
      if(err.status === 0){
        console.log("calling trans again")
        setTimeout(() =>{
          this.getTransactions(); // Call get balance again after 15secs;
        }, 10000);
      }
    });
  }


  //Modals for payment
  public async openSearchMerchantModal(){
    // this.router.navigateByUrl('/edit-profile');
    const modal = await this.modalCtrl.create({
      component: SelectMerchantPage,
      enterAnimation: myEnterAnimation,
      leaveAnimation: myLeaveAnimation
      // componentProps: {'profile': this.profile, 'user': this.user}
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

  //Modals for TopUp / Account funding
  public async openTopUpModal(){
    const modal = await this.modalCtrl.create({
      component: TopUpPage,
      enterAnimation: myEnterAnimation,
      leaveAnimation: myLeaveAnimation
    });
    await modal.present();
  }

  //Modals for Pay for a friend
  public async openSearchForFriendModal(){
    const modal = await this.modalCtrl.create({
      component: SearchUserPage,
      enterAnimation: myEnterAnimation,
      leaveAnimation: myLeaveAnimation
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

  ngOnDestroy(){

  }

}
