import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { LoginPage } from './login.page';
import { CurrencyComponentModule } from '../../components/currency/currency.module';

const routes: Routes = [
  {
    path: '',
    component: LoginPage
  }
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CurrencyComponentModule,
    RouterModule.forChild(routes)
  ],
  declarations: []
})
export class LoginPageModule {}
