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

import { PDFGenerator, PDFGeneratorOptions, PDFGeneratorOriginal } from '@ionic-native/pdf-generator';
import { ReceiptPage } from '../../modals/receipt/receipt.page';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File, IWriteOptions } from '@ionic-native/file/ngx';





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
    private file: File,
    private fileOpener: FileOpener,
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

  // public receiptHtml(): string{
  //   return ;
  // }

  public generateReceipt(){
    console.log('Clicked..');

    const html = `
    <html>
      <head>
        <style>
        div.container{
          padding: 1rem 1rem 0 1rem;
          background-color: #FFF;
          color: #232323;
          width: 100%;
          height: 100%;
        }
        
        div.logo{
          text-align: right;
        }
        
        div.logo img{
          width: 200px;
        }
        
        h1{
          margin: 0;
          font-weight: bold;
          text-align: center;
          font-size: 2rem;
          text-decoration: underline;
        }
        
        div.details{
          margin-top: 2rem;
          font-size: 1.5rem;
        }
        
        div.detail:not(div.detail:last-child){
          margin-bottom: 1rem;
        }
        
        div.detail span{
          display: inline-block;
        }
        
        div.detail span:first-child{
          color: #474747;
          margin-right: 2rem;
        }

        div.detail span:last-child{
          color: #E53F27;
          font-size: 1.7rem;
        }
        
        div.footer{
          width: 90%;
          position: absolute;
          bottom: 2rem;
          font-size: .8rem;
        }
        </style>
      </head>
      <body>
      <div class="container">
      <div class="logo">
        <img src="cdvfile://localhost/persistent/assets/imgs/legendpay-logo-full.png" alt="logo">
      </div>
      <h1>Transaction Receipt</h1>
      <div class="details">
        <div class="detail">
          <span>Invoice To:</span>
          <span>Mike Tase</span>
        </div>
        <div class="detail">
          <span>Phone Number:</span>
          <span>2348062254916</span>
        </div>
        <div class="detail">
          <span>Username:</span>
          <span>tas3</span>
        </div>
        <div class="detail">
          <span>Type:</span>
          <span>Electricity</span>
        </div>
        <div class="detail">
          <span>Amount:</span>
          <span>2000</span>
        </div>
        <div class="detail">
          <span>Description:</span>
          <span>4343-34435-34345-45453-23233</span>
        </div>
        <div class="detail">
          <span>Reference:</span>
          <span>3443h4e4g4343f</span>
        </div>
        <div class="detail">
          <span>Status:</span>
          <span>Success</span>
        </div>
        <div class="detail">
          <span>Date:</span>
          <span>Apr 21, 2021, 9:46 AM</span>
        </div>
      </div>
    </div>
      </body>
    </html
  `;

    const options: PDFGeneratorOptions = {
      documentSize: 'A4',
      type: 'base64',
      landscape: 'portrait'
    };

    PDFGenerator.fromData(html, options)
    .then(base64 => {
      console.log('stringyy>>>> ', base64);
      this.base64ToPDf(base64);
    })
    .catch(e => console.log(e));
    // this  .fromURL('https://google.es', options).then(base64String => console.log(base64String));
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

  base64ToPDf(base64_data: string){
    const directory = this.file.dataDirectory;
    const fileName = 'receipt.pdf';

    this.file.createFile(directory, fileName, true).then((response) => {
      console.log('file created',response);

      const byteCharacters = atob(base64_data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {type: 'application/pdf'});

      this.file.writeExistingFile(directory, fileName, blob).then((response) => {
        console.log('successfully wrote to file',response);

        this.fileOpener.open(directory + fileName, 'application/pdf').then((response) => {
          console.log('opened PDF file successfully',response);
        }).catch((err) => {
            console.log('error in opening pdf file',err);
        });
      }).catch((err) => {
        console.log('error writing to file',err);
      });

   }).catch((err) => {
      console.log('Error creating file',err);
   });
  }

  // base64ToPDf(base64_data: string){
  //   this.file.createFile(this.file.externalRootDirectory,'test.pdf',true).then((response) => {
  //     console.log('file created',response);

  //     const byteCharacters = atob(base64_data);
  //     const byteNumbers = new Array(byteCharacters.length);
  //     for (let i = 0; i < byteCharacters.length; i++) {
  //         byteNumbers[i] = byteCharacters.charCodeAt(i);
  //     }

  //     const byteArray = new Uint8Array(byteNumbers);
  //     const blob = new Blob([byteArray], {type: 'application/pdf'});

  //     this.file.writeExistingFile(this.file.externalRootDirectory,'test.pdf',blob).then((response) => {
  //       console.log('successfully wrote to file',response);
  //       this.fileOpener.open(this.file.externalRootDirectory + 'test.pdf','application/pdf').then((response) => {
  //         console.log('opened PDF file successfully',response);
  //       }).catch((err) => {
  //           console.log('error in opening pdf file',err);
  //       });
  //     }).catch((err) => {
  //       console.log('error writing to file',err);
  //     });

  //  }).catch((err) => {
  //     console.log('Error creating file',err);
  //  });
  // }

}
