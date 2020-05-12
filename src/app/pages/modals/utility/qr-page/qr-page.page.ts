import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-qr-page',
  templateUrl: './qr-page.page.html',
  styleUrls: ['./qr-page.page.scss'],
})
export class QrPagePage implements OnInit {

  constructor(
    private modalCtrl: ModalController,
    private utilService: UtilService) { }

  ngOnInit() {
    this.scanQRCode();
  }

  public scanQRCode(){
    this.utilService.scanQRCode()
      .then((text) =>{
        this.closeModal(text);
      })
      .catch((err) =>{
        this.closeModal(err);
        console.log(err);
      });
  }


  public closeModal(text?:string, err?:string){
    text? this.modalCtrl.dismiss({text}): this.modalCtrl.dismiss({err});
  }
}
