import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { BundleService } from 'src/app/services/bundle.service';

import { Bundle } from 'src/app/models/bundle';
import { BundleImage } from 'src/app/models/constants';
import { AuthService } from 'src/app/services/auth.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-bundle-types',
  templateUrl: './bundle-types.page.html',
  styleUrls: ['./bundle-types.page.scss'],
})
export class BundleTypesPage implements OnInit {
  
  public bundleList: Bundle;
  public reqPlanChange: boolean;


  constructor(
    private modalCtrl: ModalController,
    private auth: AuthService,
    private bundleService: BundleService,
    private utilService: UtilService,
    private navParams: NavParams) {

      this.reqPlanChange = this.navParams.get('reqPlanChange');
    }

  ngOnInit() {
    this.getBundleTypes();
  }

  private getBundleTypes(){
    this.bundleService.getBundleTypes(this.reqPlanChange).then((resp) =>{
      this.bundleList = resp.data || resp.sub;
    });
  }

  public closeModal(bundle?: Bundle){
    let activeid;
    this.reqPlanChange? activeid = 0: activeid = 1; 
    bundle? this.modalCtrl.dismiss({ bundle,  renew: activeid}): this.modalCtrl.dismiss();
  }

  public getBundleImagePath(bundleName: string): string{
    return bundleName? BundleImage[bundleName]: '';
  }

  public formatWithCommas(num: any){
    return this.utilService.numberWithCommas(num);
  }
}
