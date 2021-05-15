import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';

import jsPDF from 'jspdf';
import domtoimage from 'dom-to-image';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File, IWriteOptions } from '@ionic-native/file/ngx';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.page.html',
  styleUrls: ['./receipt.page.scss'],
})
export class ReceiptPage implements OnInit {

  constructor(
    private file: File,
    private fileOpener: FileOpener,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private util: UtilService) {}

  ngOnInit() {
  }

  public closeModal(){
    this.modalCtrl.dismiss();
  }

  exportPdf() {
    this.util.presentLoading('Creating PDF file...');
    const div = document.getElementById("printable-area");
    const options = { background: "white", height: div.clientHeight, width: div.clientWidth };
    domtoimage.toPng(div, options).then((dataUrl)=> {
      //Initialize JSPDF
    var doc = new jsPDF("p","mm","a4");
    //Add image Url to PDF
    doc.addImage(dataUrl, 'PNG', 10, 10, 200, 220);//, 20, 20, 240, 180);

    let pdfOutput = doc.output();
    // using ArrayBuffer will allow you to put image inside PDF
    let buffer = new ArrayBuffer(pdfOutput.length);
    let array = new Uint8Array(buffer);
    for (var i = 0; i < pdfOutput.length; i++) {
        array[i] = pdfOutput.charCodeAt(i);
    }

      //This is where the PDF file will stored , you can change it as you like
      // for more information please visit https://ionicframework.com/docs/native/file/the
      const directory = this.file.dataDirectory ;
      const fileName = "invoice.pdf";
      let options: IWriteOptions = { replace: true };

      this.file.checkFile(directory, fileName).then((success)=> {
        //Writing File to Device
        this.file.writeFile(directory,fileName,buffer, options)
        .then((success)=> {
          this.loadingCtrl.dismiss();
          console.log("File created Succesfully" + JSON.stringify(success));
          this.fileOpener.open(this.file.dataDirectory + fileName, 'application/pdf')
            .then(() => console.log('File is opened'))
            .catch(e => console.log('Error opening file', e));
        })
        .catch((error)=> {
          this.loadingCtrl.dismiss();
          console.log("Cannot Create File " +JSON.stringify(error));
        });
      })
      .catch((error)=> {
        //Writing File to Device
        this.file.writeFile(directory,fileName,buffer)
        .then((success)=> {
          this.loadingCtrl.dismiss();
          console.log("File created Succesfully" + JSON.stringify(success));
          this.fileOpener.open(this.file.dataDirectory + fileName, 'application/pdf')
            .then(() => console.log('File is opened'))
            .catch(e => console.log('Error opening file', e));
        })
        .catch((error)=> {
          this.loadingCtrl.dismiss();
          console.log("Cannot Create File " +JSON.stringify(error));
        });
      });
    })
    .catch(function (error) {
      this.loadingCtrl.dismiss();
      console.error('oops, something went wrong!', error);
    });
  }

}
