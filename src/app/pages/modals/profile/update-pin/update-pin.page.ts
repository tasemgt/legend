import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoadingController, ModalController, NavParams } from '@ionic/angular';
import { User } from 'src/app/models/user';
import { Balance } from 'src/app/models/wallet';
import { UserService } from 'src/app/services/user.service';
import { UtilService } from 'src/app/services/util.service';
import { WalletService } from 'src/app/services/wallet.service';

@Component({
  selector: 'app-update-pin',
  templateUrl: './update-pin.page.html',
  styleUrls: ['./update-pin.page.scss'],
})
export class UpdatePinPage implements OnInit {

  public balance: Balance;
  public user: User;

  constructor(private modalCtel: ModalController,
    private navParams: NavParams,
    private loadingCtrl: LoadingController,
    private utilService: UtilService,
    private walletService: WalletService,
    private userService: UserService) {

      this.user = this.navParams.get('user');
  }

  ngOnInit() {
    this.getBalance();
  }

  private async getBalance(){
    this.balance =  this.walletService.uniBalanceValue;
  }

  public updatePin(form: NgForm){
    if(!form.valid){
      this.utilService.showToast('All fields are required please.', 2000, 'danger');
      return;
    }

    const reg = /^\d+$/;
    if(!(reg.test(form.value.pin)) || !(reg.test(form.value.oldpin)) || !(reg.test(form.value.pin_confirmation))){
      this.utilService.showToast('One or more pins contain invalid characters', 2000, 'danger');
      return;
    }

    if(form.value.pin !== form.value.pin_confirmation){
      this.utilService.showToast('New and confirm pins do not match', 2000, 'danger');
      return;
    }
    console.log(form.value.pin, form.value.oldpin, form.value.pin_confirmation);
    const payload: any = {pin: form.value.pin, pin_confirmation: form.value.pin_confirmation};
    this.balance.pin === 'YES' ? payload.oldpin = form.value.oldpin: '';
    this.utilService.presentLoading('')
      .then(() =>{
        return this.userService.updateUserPin(this.user, payload);
      })
      .then((resp) =>{
        this.loadingCtrl.dismiss();
        if(resp.code === 100){
          this.walletService.balanceState.next(true);
          this.utilService.showToast(`${resp.message}`, 3000, 'success');
          this.closeModal();
        }
        else if(resp.code === 418){
          this.utilService.showToast(`${resp.message}`, 3000, 'danger');
          return;
        }
        else{
          this.utilService.showToast(`Pin update failed`, 2000, 'danger');
          return;
        }
      })
      .catch((error) =>{
        this.loadingCtrl.dismiss();
        this.utilService.showToast(`Pin update failed`, 2000, 'danger');
      });
  }

  public closeModal(){
    this.modalCtel.dismiss();
  }

}
