import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { ErrorModule } from '../../components/error/error.module';
import { UpdateEmailPage } from './update-email.page';


const routes: Routes = [
  {
    path: '',
    component: UpdateEmailPage
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
export class UpdateEmailPageModule {}
