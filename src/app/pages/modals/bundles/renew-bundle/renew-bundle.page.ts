import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavParams, LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { UtilService } from 'src/app/services/util.service';
import { BundleService } from 'src/app/services/bundle.service';
import { Profile } from 'src/app/models/user';
import { WalletService } from 'src/app/services/wallet.service';
import { AuthService } from 'src/app/services/auth.service';
import { Balance } from 'src/app/models/wallet';


@Component({
  selector: 'app-renew-bundle',
  templateUrl: './renew-bundle.page.html',
  styleUrls: ['./renew-bundle.page.scss'],
})
export class RenewBundlePage{

  public _amount;
  public currentBundle: Balance;
  public profile: Profile;
  public chosenPlan: any;

  public toggle: boolean;

  public plans = [
    {value: 1, name: 'Monthly', verb: 'a'},
    {value: 3, name: 'Quarterly', verb: 'a'},
    {value: 12, name: 'Annually', verb: 'an'}
  ]

  constructor(
    private navParams: NavParams,
    private router: Router,
    private modalCtrl: ModalController,
    private auth: AuthService,
    private loadingCtrl: LoadingController,
    private bundleService: BundleService,
    private walletService: WalletService,
    private utilService: UtilService) {

      this.currentBundle = this.navParams.get('bundle');
      this.profile = this.navParams.get('profile');

      this._amount = this.formatNumWithCommas(this.currentBundle.price);

      if(this.currentBundle.autorenew === 'NO'){
        this.toggle = false;
      }
      else{
        this.toggle = true;
        this.initChosenPlan();
      }
      console.log(this.currentBundle.autorenew , this.toggle);
    }


  ionViewDidEnter(){
    //For logging off on token expiration.
    setTimeout(async () =>{
      const user = await this.auth.getUser();
      this.auth.checkTokenExpiry(user);
    }, 200);
  }

  public renewBundle(form: NgForm){
    console.log(this.toggle, this.chosenPlan);
    let amount = form.value.amount;
    const pid = this.currentBundle.bundle_id;

    if(form.invalid){
      this.utilService.showToast('Please enter a valid amount.', 2000, 'danger');
      return;
    }

    if(this.toggle && !this.chosenPlan){
      this.utilService.showToast('To use auto renew, you must select a renew plan', 3000, 'danger');
      return;
    }

    let message: string;

    this.toggle ? message = `Confirm ${this.chosenPlan.verb} <strong>${this.chosenPlan.name}</strong> renewal of <strong>${amount}</strong> naira for this subscription?`:
                            message = `Confirm a one time renewal of <strong>${amount}</strong> naira for this subscription?`;

    this.utilService.presentAlertConfirm('Confirm Renewal', message, () =>{

      amount = amount.replace(/,/g, "");
      
      console.log(amount);

      this.utilService.presentLoading('Renewing Product bundle')
      .then(() =>{
        return this.bundleService.renewBundle({amount, pid});
      })
      .then((resp) =>{
        if(resp.code === 418){
          this.utilService.showToast(resp.message, 2000, 'danger');
          this.loadingCtrl.dismiss();
          return;
        } 
        else if (resp.code === 100){
          this.walletService.getBalance()
            .then((balance) =>{
              this.loadingCtrl.dismiss();
              this.utilService.showToast('Product renewal successful.', 3000, 'success');
              this.closeModal(balance);
              this.router.navigateByUrl('/tabs/home');
            });
        }
      })
      .catch((error) =>{
        this.utilService.showToast('There\'s an issue with your renewal, Please try again later', 2000, 'danger');
      })
    });

  }

  public formatNumWithCommas(amount){
    return this.utilService.numberWithCommas(amount);
  }

  public refreshModel(): void{
    this._amount = this.utilService.numberWithCommas(this._amount);
  }

  public calculateAmount(): void{
    this._amount = this.formatNumWithCommas(this.chosenPlan.value * Number(this.currentBundle.price));
  }

  public onToggle(): void{
    if(this.toggle){
      this.chosenPlan ? this.calculateAmount(): '';
    }
    else{
      this._amount = this.formatNumWithCommas(this.currentBundle.price);
    }
  }

  public initChosenPlan(): void{
    let val = this.currentBundle.autorenew_rate;

    switch(val){
      case "12":
        this.chosenPlan = this.getPlanFromValue(this.plans, 12);
        break;
      case "3":
        this.chosenPlan = this.getPlanFromValue(this.plans, 3);
        break;
      case "1":
        this.chosenPlan = this.getPlanFromValue(this.plans, 1);
        break;
    }

    this.calculateAmount();
  }

  private getPlanFromValue(arr: any[], value: number){
    let plan;
    for(let i of arr){
      if(i.value === value){
        plan = i;
      }
    }
    return plan;
  }

  public closeModal(balance?: any){
    balance? this.modalCtrl.dismiss({balance}): this.modalCtrl.dismiss();
  }
}
