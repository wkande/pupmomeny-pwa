import { NgModule } from '@angular/core';
import { ExpenseFabComponent } from './expense-fab.component';
import { IonicModule } from '@ionic/angular';
import { UpsertExpensePage } from '../../../tab1/expenses/upsert-expense/upsert-expense.page';
import { UpsertExpenseSharedPageModule } from '../../../tab1/expenses/upsert-expense/upsert-expense-shared.module';

// Example usage for ionic components
// https://www.youtube.com/watch?v=za5NaFavux4


@NgModule({
  declarations: [
    ExpenseFabComponent
  ],
  imports:[IonicModule, UpsertExpenseSharedPageModule],
  exports: [ExpenseFabComponent],
  entryComponents: [ UpsertExpensePage ],
})


export class ExpenseFabModule {}