import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LogsPage } from './logs.page';
import { LogComponent } from 'src/app/components/log/log.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: LogsPage }])
  ],
  declarations: [LogsPage, LogComponent]
})
export class LogsPageModule {}
