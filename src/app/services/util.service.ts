import { Injectable } from '@angular/core';
import { ToastController, LoadingController, AlertController, Platform, ActionSheetController } from '@ionic/angular';
import { HttpErrorResponse } from '@angular/common/http';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(
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
