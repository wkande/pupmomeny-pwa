import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';

import { ErrorModule } from '../components/error/error.module';
import { LoadingModule } from '../components/loading/loading.module';

import { UpsertExpenseSharedPageModule } from  '../tab1/expenses/upsert-expense/upsert-expense-shared.module';
import { DeleteExpenseSharedPageModule } from  '../tab1/expenses/delete-expense/delete-expense-shared.module';



import { UpsertExpensePage } from '../tab1/expenses/upsert-expense/upsert-expense.page';
import { DeleteExpensePage } from '../tab1/expenses/delete-expense/delete-expense.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ErrorModule,
    LoadingModule,
    UpsertExpenseSharedPageModule,
    DeleteExpenseSharedPageModule,
    RouterModule.forChild([
      { path: '', component: Tab2Page }, 
      //{ path: '/delete-expense', component: DeleteExpensePage },
      //{ path: '/upsert-expense', component: UpsertExpensePage },
    ])
    
  ],
  declarations: [Tab2Page],
  entryComponents: [ UpsertExpensePage, DeleteExpensePage ],

})
export class Tab2PageModule {}
