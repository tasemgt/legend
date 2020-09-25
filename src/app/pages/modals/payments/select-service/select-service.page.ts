import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ServiceDetailsPage } from '../service-details/service-details.page';
import { myEnterAnimation } from 'src/app/animations/enter';
import { myLeaveAnimation } from 'src/app/animations/leave';
import { BuyPowerPage } from '../buy-power/buy-power.page';
import { BuyDstvPage } from '../buy-dstv/buy-dstv.page';
import { BuyAirtimePage } from '../buy-airtime/buy-airtime.page';

@Component({
  selector: 'app-select-service',
  templateUrl: './select-service.page.html',
  styleUrls: ['./select-service.page.scss'],
})
export class SelectServicePage implements OnInit {

  public services = [
    {
      name: "Legend TV",
      desc: "Legend TV that offers movies and series through Legend Box Office, Legend Vault, and Legend Freeview.",
      img: "",
      icon: "assets/imgs/img-legendtv.svg",
      status: 'active',
      id: 1
    },
    {
      name: "Buy Electricity",
      desc: "",
      img: "",
      icon: "assets/imgs/img-aedc.svg",
      status: 'active',
      id: 2
    },
    {
      name: "Dstv",
      desc: "Legend Pay allows you to pay your Cable bills",
      img: "assets/imgs/dstvlogo.jpg",
      icon: "assets/imgs/img-dstv.svg",
      status: 'active',
      id: 3
    },
    {
      name: "Airtime",
      desc: "Legend Pay allows you to buy Airtime.",
      img: "",
      icon: "assets/imgs/img-airtime.svg",
      status: 'active',
      id: 4
    },
    {
      name: "Netflix",
      desc: "Watch Netflix movies & TV shows online or stream right to your smart TV, game console, PC, Mac, mobile, tablet and more.",
      img: "assets/imgs/logo-netflix.svg",
      icon: "assets/imgs/img-netflix.svg",
      status: 'inactive',
      id: 5
    }
  ]

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  public async openServiceDetailsModal(service){
    let serviceName = this.getServiceType(service.name);
    let component: any;

    if(serviceName === 'legendtv' || serviceName === 'netflix'){
      const modal = await this.modalCtrl.create({
        component: ServiceDetailsPage,
        enterAnimation: myEnterAnimation,
        leaveAnimation: myLeaveAnimation,
        componentProps: {'service': service}
      });
      await modal.present();
    }
    else{
      switch(serviceName){
        case 'buyelectricity':
          component = BuyPowerPage;
          break;
        case 'dstv':
          component = BuyDstvPage;
          break;
        case 'airtime':
          component = BuyAirtimePage;
          break;
      }
      return this.openBuyServiceModal(service, component);
    }
    
  }

  public async openBuyServiceModal(service, component){

    const modal = await this.modalCtrl.create({
      component,
      enterAnimation: myEnterAnimation,
      leaveAnimation: myLeaveAnimation,
      componentProps: {'service': service}
    });
    await modal.present();
  }

  public getServiceType(type:string): string{
    return type.toLowerCase().replace(/ /g,'');
  }

  public closeModal(){
    this.modalCtrl.dismiss();
  }
}
