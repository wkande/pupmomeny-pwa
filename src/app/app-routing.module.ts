import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'filter', loadChildren: './modals/filter/filter.module#FilterPageModule' },

  { path: 'expenses', loadChildren: './tab1/expenses/expenses.module#ExpensesPageModule' },


  { path: 'expenses/:id/:name', loadChildren: './tab1/expenses/expenses.module#ExpensesPageModule' },
  //{ path: 'expense/:id/:vendor/:amt/:dttm/:note/:catId/:catName/:rootTab', loadChildren: './tab1/expenses/expense/expense.module#ExpensePageModule' },
  //{ path: 'expense', loadChildren: './tab1/expenses/expense/expense.module#ExpensePageModule' },

  
  { path: 'term', loadChildren: './tab3/term/term.module#TermPageModule' },
  { path: 'tips', loadChildren: './tab3/tips/tips.module#TipsPageModule' },
  { path: 'subscribe', loadChildren: './tab3/subscribe/subscribe.module#SubscribePageModule' },
  
  // MODAL{ path: 'upsert-expense', loadChildren: './tab1/expenses/upsert-expense/upsert-expense.module#UpsertExpensePageModule' },
  // MODAL { path: 'update-name', loadChildren: './tab3/update-name/update-name.module#UpdateNamePageModule' },
  // MODAL { path: 'delete-expense', loadChildren: './tab1/expenses/delete-expense/delete-expense.module#DeleteExpensePageModule' },
  // MODAL { path: 'delete-category', loadChildren: './tab1/delete-category/delete-category.page.module#DeleteCategoryPageModule' }
  // MODAL { path: 'update-email', loadChildren: './tab3/update-email/update-email.module#UpdateEmailPageModule' },

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
