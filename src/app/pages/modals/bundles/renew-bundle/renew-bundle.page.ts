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
import { Plans } from 'src/app/models/constants';


@Component({
  selector: 'app-renew-bundle',
  templateUrl: './renew-bundle.page.html',
  styleUrls: ['./renew-bundle.page.scss'],
})
export class RenewBundlePage{

  public _amount;
  public currentBalance: Balance;
  public profile: Profile;
  public chosenPlan: any;

  public toggle: boolean;
  public disableToggle: boolean;

  public plans = Plans;

  constructor(
    private navParams: NavParams,
    private router: Router,
    private modalCtrl: ModalController,
    private auth: AuthService,
    private loadingCtrl: LoadingController,
    private bundleService: BundleService,
    private walletService: WalletService,
    private utilService: UtilService) {

      this.currentBalance = this.navParams.get('bundle');
      this.profile = this.navParams.get('profile');
      this.toggle = false;

      this._amount = this.formatNumWithCommas(this.currentBalance.price);

      if(this.currentBalance.period === 'month'){
        this.disableToggle = false;

        if(this.currentBalance.autorenew === 'NO'){
          this.toggle = false;
        }
        else{
          this.toggle = true;
          this.initChosenPlan();
        }
      }
      else{
        this.disableToggle = true;
      }

      console.log(this.currentBalance.autorenew , this.toggle);
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
    const pid = this.currentBalance.bundle_id;

    if(form.invalid){
      this.utilService.showToast('Please enter a valid amount.', 2000, 'danger');
      return;
    }

    if(this.toggle && !this.chosenPlan){
      this.utilService.showToast('To use auto renew, you must select a renew plan', 3000, 'danger');
      return;
    }

    let rate;
    this.toggle ? rate = this.chosenPlan.value : rate = 0;

    console.log(this.toggle, rate, amount, pid);

    let message: string;

    this.toggle ? message = `Confirm ${this.chosenPlan.verb} <strong>${this.chosenPlan.name}</strong> renewal of <strong>${amount}</strong> naira for this subscription?`:
                            message = `Confirm a one time renewal of <strong>${amount}</strong> naira for this subscription?`;

    this.utilService.presentAlertConfirm('Confirm Renewal', message, () =>{

      amount = amount.replace(/,/g, "");

      this.utilService.presentLoading('Renewing Product bundle')
      .then(() =>{
        return this.bundleService.renewBundle({amount, pid, autorenew:Number(this.toggle), autorenew_rate: rate});
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
    this._amount = this.formatNumWithCommas(this.chosenPlan.value * Number(this.currentBalance.price));
  }

  public onToggle(): void{
    if(this.toggle){
      this.chosenPlan ? this.calculateAmount(): '';
    }
    else{
      this._amount = this.formatNumWithCommas(this.currentBalance.price);
    }
  }

  public initChosenPlan(): void{
    let val = this.currentBalance.autorenew_rate;

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

  public onTapToggle(){
    if(this.disableToggle){
      this.utilService.showToast('You can only activate auto renewal on a month plan', 3000, 'danger');
    }
  }

  public closeModal(balance?: any){
    balance? this.modalCtrl.dismiss({balance}): this.modalCtrl.dismiss();
  }
}
