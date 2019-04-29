import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SwitchWalletPage } from './switch-wallet.page';
import { ErrorModule } from '../../components/error/error.module';


const routes: Routes = [
  {
    path: '',
    component: SwitchWalletPage
  }
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ErrorModule,
    RouterModule.forChild(routes)
  ],
  declarations: []
})


export class UpsertWalletPageModule {}
