import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ExpensesPage } from './expenses.page';
import { ErrorModule } from '../../components/error/error.module';
import { LoadingModule } from '../../components/loading/loading.module';
import { ExpenseFabModule } from '../../components/expenses/expense-fab/expense-fab.module';

import { UpsertExpenseSharedPageModule } from  './upsert-expense/upsert-expense-shared.module';
import { DeleteExpenseSharedPageModule } from  './delete-expense/delete-expense-shared.module';


//import { UpsertCategoryPage } from './../upsert-category/upsert-category.page';

import { UpsertExpensePage } from './upsert-expense/upsert-expense.page';
import { DeleteExpensePage } from './delete-expense/delete-expense.page';

const routes: Routes = [
  { path: '',component: ExpensesPage },
  //{ path: '/delete-expense', component: DeleteExpensePage },
  //{ path: '/upsert-expense', component: UpsertExpensePage },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ErrorModule,
    LoadingModule,
    UpsertExpenseSharedPageModule,
    DeleteExpenseSharedPageModule,
    ExpenseFabModule,

    RouterModule.forChild(routes)
  ],

  declarations: [ExpensesPage],

  entryComponents: [ UpsertExpensePage, DeleteExpensePage ],
})
export class ExpensesPageModule {}
