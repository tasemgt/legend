import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-service-details',
  templateUrl: './service-details.page.html',
  styleUrls: ['./service-details.page.scss'],
})
export class ServiceDetailsPage implements OnInit {

  public service;

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private utilService: UtilService) {

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

    this.utilService.presentAlert('Success...');
    this.closeModal();
  }

  public closeModal(){
    this.modalCtrl.dismiss();
  }

}
