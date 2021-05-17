import { Injectable } from '@angular/core';
import { ToastController, LoadingController, AlertController, Platform, ActionSheetController } from '@ionic/angular';
import { HttpErrorResponse } from '@angular/common/http';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { Transaction } from '../models/transaction';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File, IWriteOptions } from '@ionic-native/file/ngx';
import { PDFGenerator, PDFGeneratorOptions, PDFGeneratorOriginal } from '@ionic-native/pdf-generator';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(
    private file: File,
    private fileOpener: FileOpener,
    private toastCtrl: ToastController,
    private platform: Platform,
    private barcodeScanner: BarcodeScanner,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private actionSheetController: ActionSheetController
    ) { }

  public async showToast(message: string, duration: number, color: string) {

    if(this.platform.is('ios')){
      this.presentAlert(message);
      return;
    }

    const toast = await this.toastCtrl.create({
      message,
      position: 'top',
      translucent: true,
      color,
      duration
    });
    toast.present();
  }

  public async presentLoading(message: string){
    const loading = await this.loadingCtrl.create({
      message: `<div class="loader"></div>`,
      translucent: true,
      cssClass: 'legend-loader'
    });
    return loading.present();
  }

  public async dismissLoading(id?: string){
    return await this.loadingCtrl.dismiss(null, null, id);
  }

  public async presentAlert(message: string) {
    const alert = await this.alertCtrl.create({
      // header,
      // subHeader: 'Subtitle',
      message,
      buttons: ['Ok']
    });
    await alert.present();
  }

  public async presentAlertConfirm(header:string, message: string, okayCallBack: Function, noBut?:string, yesBut?:string) {
    const alert = await this.alertCtrl.create({
        header,
        message,
        buttons: [
          {
            text: noBut || 'No',
            role: 'cancel',
            cssClass: 'primary',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
            }
          }, {
            text: yesBut || 'Yes',
            handler: () => {
              okayCallBack();
            }
          }
        ]
      });
    await alert.present();
  }

  public async presentActionSheet(buttons: any[]) {
    const actionSheet = await this.actionSheetController.create({
      cssClass: 'my-custom-class',
      mode: this.platform.is('ios') ? 'ios' : 'md',
      buttons: buttons.concat([
        {
          text: 'Cancel',
          // icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ])
    });
    await actionSheet.present();
  }

  public validateEmail(email): boolean{
    // tslint:disable-next-line:max-line-length
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  public validatePhone(phone): boolean{
    if(Number(phone) === NaN){
      return false;
    }
    if(phone.length < 13){
      return false;
    }
    return true;
  }

  public greetMessage(currentTime = new Date()): string{
      const currentHour = currentTime.getHours();
      const splitAfternoon = 12; // 24hr time to split the afternoon
      const splitEvening = 16; // 24hr time to split the evening
    
      if (currentHour >= splitAfternoon && currentHour <= splitEvening) {
        // Between 12 PM and 5PM
        return 'Good afternoon';
      } else if (currentHour >= splitEvening) {
        // Between 5PM and Midnight
        return 'Good evening';
      }
      // Between dawn and noon
      return 'Good morning';
  }

  public getDateDifference(endDate: Date, startDate: Date): number{
    let days = (endDate.getTime() - startDate.getTime()) / 86400000;
    days = Math.floor(days);
    if(days <= 0 ){
      return 0;
    }
    return days;
  }

  public transformPhone(phone: string){
    let newPhone = '';
    newPhone = `234${phone.substring(1)}`;
    return newPhone;
  }

  public scanQRCode(): Promise<any>{

    let options: BarcodeScannerOptions;

    options = {
      prompt : "Position the QR code inside the scanner window",
      disableSuccessBeep: true
    }

    if (this.platform.is('cordova')) {
      return this.barcodeScanner.scan(options)
        .then((scanResult) => {
          if(scanResult){
            return scanResult.text;
          }
          return '';
        }, (err) => {
            return  err;
        });
    }
    else {
      return Promise.reject('Cordova not available');
    }
  }


  public isMerchant(word: string): boolean{
    if(word.search(/%%%/) != -1){
      return true;
    }
    return false;
  }

  public isUser(word: string): boolean{
    if(word.search(/%%-%/) != -1){
      return true;
    }
    return false;
  }

  public generateHtmlForPdf(transaction: Transaction): string{
    const html = `
    <html>
      <head>
        <style>
        div.container{
          padding: .5rem 1rem 0 1rem;
          background-color: #FFF;
          color: #232323;
        }
        div.logo{
          text-align: right;
          padding-right: 1rem;
        }
        div.logo p{
          font-size: 1.5rem;
        }
        div.logo span:first-child{
          color: #E53F27;
        }
        div.logo span:last-child{
          color: #232323;
          font-weight: bold;
        }
        div.logo img{
          width: 200px;
        }
        h1{
          margin: 2rem 0 3rem 0;
          text-align: center;
          font-size: 2rem;
          text-decoration: underline;
        }
        div.details{
          margin-top: 4rem;
          margin-bottom: -4rem;
          font-size: 1.5rem;
        }
        div.detail:not(div.detail:last-child){
          margin-bottom: .8rem;
        }
        div.detail span{
          display: inline-block;
        }
        div.detail span:first-child{
          color: #474747;
          margin-right: 2rem;
          width: 25%;
          font-size: 1.5rem;
        }
        div.detail span:last-child{
          color: #E53F27;
          font-size: 1.7rem;
        }
        div.footer{
          width: 90%;
          position: absolute;
          bottom: 2rem;
          font-size: 1rem;
        }
        </style>
      </head>
      <body>
      <div class="container">
      <div class="logo">
        <p><span>Legend</span><span>Pay</span></p>
      </div>
      <h1>Transaction Receipt</h1>
      <div class="detail">
        <span>Invoice To:</span>
        <span>${transaction.name}</span>
      </div>
      <div class="detail">
        <span>Phone Number:</span>
        <span>${transaction.phone}</span>
      </div>
      <div class="detail">
        <span>Username:</span>
        <span>${transaction.username}</span>
      </div>
      <div class="detail">
        <span>Type:</span>
        <span>${transaction.type}</span>
      </div>
      <div class="detail">
        <span>Amount:</span>
        <span>${transaction.amount}</span>
      </div>
      <div class="detail">
        <span>Description:</span>
        <span>${transaction.product}</span>
      </div>
      <div class="detail">
        <span>Reference:</span>
        <span>${transaction.ref}</span>
      </div>
      <div class="detail">
        <span>Status:</span>
        <span>${transaction.status}</span>
      </div>
      <div class="detail">
        <span>Date:</span>
        <span>${transaction.date}</span>
      </div>
    </div>
    <div class="footer">
      This is an electronic receipt of a transaction. For any other assistance, kindly call Legend on 0700-69-534363 or email us at experience@legend.ng.
    </div>
  </body>
  </html
  `;
        return html;
  }

  public generateReceipt(transaction: Transaction){
    console.log('Clicked..');
    const html = this.generateHtmlForPdf(transaction);
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

  public base64ToPDf(base64_data: string){
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

  public getErrorMessage(error: HttpErrorResponse): string {
    let message;
    switch(error.statusText) {
      case('Unauthorized'):
        message = 'Invalid Login Credentials';
        break;
    }
    return message;
  }

  public numberWithCommas(x): string{
    x = x.toString().replace(/,/g, "");
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

}
