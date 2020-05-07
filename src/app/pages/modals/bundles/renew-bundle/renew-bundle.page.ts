import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavParams, LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { UtilService } from 'src/app/services/util.service';
import { Bundle } from 'src/app/models/bundle';
import { BundleService } from 'src/app/services/bundle.service';
import { Profile } from 'src/app/models/user';
import { WalletService } from 'src/app/services/wallet.service';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-renew-bundle',
  templateUrl: './renew-bundle.page.html',
  styleUrls: ['./renew-bundle.page.scss'],
})
export class RenewBundlePage{

  public amount;
  public currentBundle;
  public profile: Profile;

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
    }


  ionViewDidEnter(){
    setTimeout(async () =>{
      const user = await this.auth.getUser();
      this.auth.checkTokenExpiry(user);
    }, 200);
  }

  public renewBundle(form: NgForm){
    if(form.invalid){
      this.utilService.showToast('Please enter a valid amount.', 2000, 'danger');
      return;
    }

    this.utilService.presentAlertConfirm('Confirm Renewal', 'Are you sure you wan\'t to renew this plan?', () =>{
      const amount = form.value.amount;
      const pid = this.currentBundle.bundle_id;

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


  public closeModal(balance?: any){
    balance? this.modalCtrl.dismiss({balance}): this.modalCtrl.dismiss();
  }
}
