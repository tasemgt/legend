import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ServiceDetailsPage } from '../service-details/service-details.page';
import { myEnterAnimation } from 'src/app/animations/enter';
import { myLeaveAnimation } from 'src/app/animations/leave';
import { BuyPowerPage } from '../buy-power/buy-power.page';

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
      id: 1
    },
    {
      name: "Netflix",
      desc: "Watch Netflix movies & TV shows online or stream right to your smart TV, game console, PC, Mac, mobile, tablet and more.",
      img: "assets/imgs/netflixlogo.png",
      icon: "assets/imgs/img-netflix.svg",
      status: 'inactive',
      id: 2
    },
    {
      name: "Dstv",
      desc: "Discover new blockbusters & must-see TV shows, selected to keep you glued to your screen on DSTV.",
      img: "assets/imgs/dstvlogo.jpg",
      icon: "assets/imgs/img-dstv.svg",
      status: 'inactive',
      id: 3
    }
  ]

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  public async openServiceDetailsModal(service){
    let serviceName = this.getServiceType(service.name);
    if(serviceName === 'buyelectricity'){
      return this.openBuyPowerModal(service);
    }
    const modal = await this.modalCtrl.create({
      component: ServiceDetailsPage,
      enterAnimation: myEnterAnimation,
      leaveAnimation: myLeaveAnimation,
      componentProps: {'service': service}
    });
    await modal.present();
  }

  public async openBuyPowerModal(service){
    const modal = await this.modalCtrl.create({
      component: BuyPowerPage,
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
