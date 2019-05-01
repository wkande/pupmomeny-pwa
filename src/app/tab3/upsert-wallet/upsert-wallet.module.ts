import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { UpsertWalletPage } from './upsert-wallet.page';
import { ErrorModule } from '../../components/error/error.module';
import { CurrencyComponentModule } from '../../components/currency/currency.module';


const routes: Routes = [
  {
    path: '',
    component: UpsertWalletPage
  }
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ErrorModule,
    CurrencyComponentModule,
    RouterModule.forChild(routes)
  ],
  declarations: []
})


export class UpsertWalletPageModule {}
