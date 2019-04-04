import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ErrorModule } from '../../../components/error/error.module';

import { IonicModule } from '@ionic/angular';

import { UpsertExpenseSharedPageModule } from  '../upsert-expense/upsert-expense-shared.module';
import { DeleteExpenseSharedPageModule } from  '../delete-expense/delete-expense-shared.module';
import { ExpensePage } from './expense.page';
import { UpsertExpensePage } from '../upsert-expense/upsert-expense.page';
import { DeleteExpensePage } from '../delete-expense/delete-expense.page';

const routes: Routes = [
  {
    path: '',
    component: ExpensePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ErrorModule,
    UpsertExpenseSharedPageModule,
    DeleteExpenseSharedPageModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ExpensePage],
  entryComponents: [ UpsertExpensePage, DeleteExpensePage ]
})
export class ExpensePageModule {}
