import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuyBundlePage } from './buy-bundle.page';

const routes: Routes = [
  {
    path: '',
    component: BuyBundlePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuyBundlePageRoutingModule {}
