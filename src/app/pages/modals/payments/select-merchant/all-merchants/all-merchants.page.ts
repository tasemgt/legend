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

  public merchantWrapper: MerchantWrapper; //Contains all details about merchants api call
  public totalMerchants: Merchant[];  // Total merchants stores in memory (when list is refreshed this gets populated)
  public displayedMerchants: Merchant[]; // Merchants being displayed at a point

  public searchMode: boolean; // Whether modal is on view all merchants or search mode.
  public searchWord: string; // Word in search field for a merchant

  public showLoading: boolean;

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private merchantService: MerchantService,
    private utilService: UtilService) { 

      this.merchantWrapper = this.navParams.get('merchant-wrapper'); //If modal is loaded from see all
      this.searchWord = this.navParams.get('search-word');  //If its from a search.

      this.totalMerchants = [];
      this.displayedMerchants = [];

      this.searchMode = false;
  }

  ngOnInit() {
    if(this.merchantWrapper){  // Modal is loaded from see all button
      this.totalMerchants = this.merchantWrapper.data;
      this.displayedMerchants = [...this.totalMerchants];
    }
    else{ // Modal is loaded from search
      this.searchMode = true;
      this.getSearchedMerchants();
    }
  }


  public getSearchedMerchants(){ // Search using keywords to filter merchants
    this.showLoading = true;
    this.merchantService.getSearchedMerchants(false, '', {name: this.searchWord})
      .then((merchantWrapper: MerchantWrapper) =>{

        this.showLoading = false;

        this.merchantWrapper = merchantWrapper;
        this.totalMerchants = this.merchantWrapper.data;
        this.displayedMerchants = [...this.totalMerchants];
      })
      .catch((err) =>{
        console.log(err);
      });
  }


  public doRefresh(event): void{ //Perform data refresh by calling apis with urls provided by previous calls
    if(!this.merchantWrapper){
      event.target.complete();
      return;
    }
    else if(!this.merchantWrapper.next_page_url){
      setTimeout(()=>{
        event.target.complete();
        this.utilService.showToast('All Merchants loaded...', 2000, 'success');
      },500);
      return;
    }

    if(this.searchMode){
      event.target.complete();
      return;
    }
    else{
      this.merchantService.getMerchants(true, this.merchantWrapper.next_page_url)
      .then((merchantWrapper: MerchantWrapper) =>{
        if(merchantWrapper.data.length > 0){
          console.log("theres merchant data");
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
    
  }

  public closeModal(merchant?: Merchant){
    merchant? this.modalCtrl.dismiss({merchant}): this.modalCtrl.dismiss();
  }

}
