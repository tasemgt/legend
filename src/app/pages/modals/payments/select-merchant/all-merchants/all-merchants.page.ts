import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Merchant, MerchantWrapper } from 'src/app/models/merchant';
import { MerchantService } from 'src/app/services/merchant.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-all-merchants',
  templateUrl: './all-merchants.page.html',
  styleUrls: ['./all-merchants.page.scss'],
})
export class AllMerchantsPage implements OnInit {

  public merchantWrapper: MerchantWrapper;
  public totalMerchants: Merchant[];
  public displayedMerchants: Merchant[];

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private merchantService: MerchantService,
    private utilService: UtilService) { 

      this.merchantWrapper = this.navParams.get('merchant-wrapper');
      this.totalMerchants = [];
    }

  ngOnInit() {
    this.totalMerchants = this.merchantWrapper.data;
    this.displayedMerchants = [...this.totalMerchants];
  }


  public doRefresh(event){
    if(!this.merchantWrapper.next_page_url){
      setTimeout(()=>{
        event.target.complete();
        this.utilService.showToast('All Merchants loaded...', 2000, 'success');
      },500);
      return;
    }
    this.merchantService.getMerchants(true, this.merchantWrapper.next_page_url)
      .then((merchantWrapper: MerchantWrapper) =>{
        if(merchantWrapper.data.length > 0){
          console.log("called...");
          this.merchantWrapper = merchantWrapper;
          console.log(this.merchantWrapper);
          this.totalMerchants = this.totalMerchants.reverse().concat(merchantWrapper.data);
          this.displayedMerchants = [...this.totalMerchants].reverse();
          event.target.complete(); //Complete refreshing..
        }
      })
      .catch((err) =>{
        console.log(err);
      });
  }

  public closeModal(){
    this.modalCtrl.dismiss();
  }

}
