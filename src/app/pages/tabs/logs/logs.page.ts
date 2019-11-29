import { Component } from '@angular/core';
import { Data } from 'src/app/models/constants';

@Component({
  selector: 'app-logs',
  templateUrl: 'logs.page.html',
  styleUrls: ['logs.page.scss']
})
export class LogsPage {

  data: any[] = Data.records;

  constructor() {
    this.data[0].open = true;
  }

  toggleItem(index){
    this.data[index].open = !this.data[index].open;
  }

}
