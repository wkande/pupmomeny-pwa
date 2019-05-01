import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';


import { ErrorModule } from '../../components/error/error.module';
import { IonicModule } from '@ionic/angular';
import { DeleteWalletPage } from './delete-wallet.page';

const routes: Routes = [
  {
    path: '',
    component: DeleteWalletPage
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
export class DeleteWalletPageModule {}
