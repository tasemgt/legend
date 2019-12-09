import { Injectable } from '@angular/core';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
    ) { }

  public async showToast(message: string, duration: number, color: string) {
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
      translucent: true
    });
    return loading.present();
  }

  public async dismissLoading(id?: string){
    return await this.loadingCtrl.dismiss(null, null, id);
  }

  public async presentAlertConfirm(header:string, message: string, okayCallBack: Function) {
    console.log('Alert called');
    const alert = await this.alertCtrl.create({
        header,
        message,
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            cssClass: 'primary',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
            }
          }, {
            text: 'Yes',
            handler: () => {
              okayCallBack();
            }
          }
        ]
      });
    await alert.present();
    }

  public validateEmail(email): boolean{
    // tslint:disable-next-line:max-line-length
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
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
    const days = (endDate.getTime() - startDate.getTime()) / 86400000;
    return Math.floor(days);
  }

  public transformPhone(phone: string){
    let newPhone = '';
    newPhone = `234${phone.substring(1)}`;
    return newPhone;
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

}
