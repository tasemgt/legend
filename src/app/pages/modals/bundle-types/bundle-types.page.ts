import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BundleService } from 'src/app/services/bundle.service';

import { Bundle } from 'src/app/models/bundle';
import { BundleImage } from 'src/app/models/constants';

@Component({
  selector: 'app-bundle-types',
  templateUrl: './bundle-types.page.html',
  styleUrls: ['./bundle-types.page.scss'],
})
export class BundleTypesPage implements OnInit {
  
  public bundleList: Bundle;

  constructor(
    private modalCtrl: ModalController,
    private bundleService: BundleService) { }

  ngOnInit() {
    this.getBundleTypes();
  }

  private getBundleTypes(){
    this.bundleService.getBundleTypes().then((bundles) =>{
      this.bundleList = bundles;
    });
  }

  public closeModal(bundle?: Bundle){
    bundle? this.modalCtrl.dismiss({ bundle,  renew: this.bundleList.renew}): this.modalCtrl.dismiss();
  }

  public getBundleImagePath(bundleName: string): string{
    return bundleName? BundleImage[bundleName]: '';
  }
}
