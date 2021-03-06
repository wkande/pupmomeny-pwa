import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';



// ErrorModule child modals use it as well, though they also must declare it.
import { ErrorModule } from '../components/error/error.module';
import { LoadingModule } from '../components/loading/loading.module';
import { ExpenseFabModule } from '../components/expenses/expense-fab/expense-fab.module';


import { DeleteExpenseSharedPageModule } from  './expenses/delete-expense/delete-expense-shared.module';
import { UpsertCategoryPage } from './categories/upsert-category/upsert-category.page';
import { DeleteCategoryPage } from './categories/delete-category/delete-category.page';

import { DeleteExpensePage } from './expenses/delete-expense/delete-expense.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ErrorModule,
    LoadingModule,
    DeleteExpenseSharedPageModule,
    ExpenseFabModule,
    RouterModule.forChild([
      { path: '', component: Tab1Page }, 
      { path: '/upsert-category', component: UpsertCategoryPage },
      { path: '/delete-category', component: DeleteCategoryPage }
    ])
  ],
  declarations: [Tab1Page, UpsertCategoryPage, DeleteCategoryPage],
  entryComponents: [ DeleteExpensePage ],
})
export class Tab1PageModule {}
