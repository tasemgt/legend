import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { UtilService } from 'src/app/services/util.service';
import { Constants } from 'src/app/models/constants';
import { TvServicesService } from 'src/app/services/tv-services.service';

@Component({
  selector: 'app-service-details',
  templateUrl: './service-details.page.html',
  styleUrls: ['./service-details.page.scss'],
})
export class ServiceDetailsPage implements OnInit {

  public service;

  private baseUrl = Constants.baseUrl;

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private utilService: UtilService,
    private loadingCtrl: LoadingController,
    private tvService: TvServicesService) {

      this.service = this.navParams.get('service');
  }

  ngOnInit() {
  }

  public subscribe(form: NgForm): void{
    if(form.invalid){
      this.utilService.showToast('Kindly enter your email address', 3000, 'danger');
      return;
    }

    if(!this.utilService.validateEmail(form.value.email)){
      this.utilService.showToast('Please enter a valid email.', 2000, 'danger');
      return;
    }

    let payload = {
      email: form.value.email,
      type: this.getServiceType(this.service.name)
    }

    console.log(payload);

    this.utilService.presentLoading('')
      .then(() =>{
        return this.tvService.SubscribeToTvUpdate(payload)
          .then((resp) =>{
            if(resp.code === 100){
              this.loadingCtrl.dismiss();
              this.utilService.presentAlert(resp.message);
              this.closeModal();
            }
            else if(resp.code === 418){
              this.utilService.showToast(resp.message, 3000, 'danger');
              this.loadingCtrl.dismiss();
            }
          })
      }).catch((err) =>{
        if(err.status === 500 || err.status === 0){
          this.utilService.showToast(`Cannot reach server, try again later`, 3000, 'danger');
          this.loadingCtrl.dismiss();
        }
      });
  }

  public getServiceType(type:string): string{
    return type.toLowerCase().replace(/ /g,'');
  }

  public openLegendTv(): void{
    window.open("https://www.legendtv.ng", '_system', 'location=yes');
  }

  public closeModal(){
    this.modalCtrl.dismiss();
  }

}
