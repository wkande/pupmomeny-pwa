import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ExpensesPage } from './expenses.page';
import { ErrorModule } from '../../components/error/error.module';
import { LoadingModule } from '../../components/loading/loading.module';

//import { UpsertCategoryPage } from './../upsert-category/upsert-category.page';

import { UpsertExpensePage } from '../../tab1/expenses/upsert-expense/upsert-expense.page';
import { DeleteExpensePage } from '../../tab1/expenses/delete-expense/delete-expense.page';

const routes: Routes = [
  { path: '',component: ExpensesPage },
  { path: '/delete-expense', component: DeleteExpensePage },
  { path: '/upsert-expense', component: UpsertExpensePage },
  //{ path: '/upsert-expense', component: UpsertCategoryPage }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ErrorModule,
    LoadingModule,
    RouterModule.forChild(routes)
  ],

  declarations: [ExpensesPage, DeleteExpensePage, UpsertExpensePage]
})
export class ExpensesPageModule {}
