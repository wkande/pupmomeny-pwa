import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';


//import { IonicModule } from '@ionic/angular';
import { UpsertExpensePage } from './upsert-expense.page';

const routes: Routes = [
  {
    path: '',
    component: UpsertExpensePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    //IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: []
})
export class UpsertExpensePageModule {}
