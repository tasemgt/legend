import { Component } from '@angular/core';
import { Data } from 'src/app/models/constants';

@Component({
  selector: 'app-logs',
  templateUrl: 'logs.page.html',
  styleUrls: ['logs.page.scss']
})
export class LogsPage {

  public data: any = Data;
  public category: string;

  constructor() {
    this.category = 'payment';
  }

  toggleItem(categoryName: string, index){
    this.data[categoryName][index].open = !this.data[categoryName][index].open;
  }

  segmentChanged(event){
    console.log(event.detail.value);
    this.category = event.detail.value;
  }

}
