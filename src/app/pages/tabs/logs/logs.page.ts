import { Component, OnInit } from '@angular/core';

import { LogService } from 'src/app/services/log.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-logs',
  templateUrl: 'logs.page.html',
  styleUrls: ['logs.page.scss']
})
export class LogsPage implements OnInit {

  public records: any
  public usageLogs: any
  public financialLogs: any
  
  public category: string;

  public authSubscription: Subscription;

  constructor(
    private logService: LogService,
    private authService: AuthService) {
    this.category = 'payment';
  }


  ngOnInit(){

    this.authSubscription = this.authService.getAuthStateSubject().subscribe((state) =>{
      if(state){
        this.init();
      }
      else{
        this.records = []; this.usageLogs = []; this.financialLogs = []; this.category = 'payment';
      }
    });
    
  }

  ionViewWillEnter(){
    if(!this.records || !this.usageLogs || !this.financialLogs){
      this.init();
    }
  }


  private init(){
    this.authService.getUser()
      .then((user: User) =>{
        this.getTransactionRecords(user);
        this.getUsageLogs(user);
        this.getFinancialLogs(user);
      });
  }


  private async getTransactionRecords(user: User){
    this.records = await this.logService.getTransactionRecords(user);
  }

  private async getUsageLogs(user: User){
    const response: any  = await this.logService.getUsageLogs(user);
    this.usageLogs = response.data;
  }

  private async getFinancialLogs(user: User){
    const response: any  = await this.logService.getFinancialLogs(user);
    this.financialLogs = response.data;
  }

  // For toggling of individual Items on list
  toggleItem(categoryName: string, index){
    switch(categoryName){
      case('usage'):
        this.usageLogs[index].open = !this.usageLogs[index].open;
        break;
      case('records'):
        this.records[index].open = !this.records[index].open;
        break;
      case('financial'):
        this.financialLogs[index].open = !this.financialLogs[index].open;
        break;
    }
  }


  // Handles Segment tabs
  segmentChanged(event){
    this.category = event.detail.value;
  }

}
