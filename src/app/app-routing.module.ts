import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'filter', loadChildren: './modals/filter/filter.module#FilterPageModule' },
  { path: 'expenses/:id/:name', loadChildren: './tab1/expenses/expenses.module#ExpensesPageModule' },
  //{ path: 'delete-expense', loadChildren: './tab1/expenses/delete-expense/delete-expense.module#DeleteExpensePageModule' },
  //{ path: 'delete-category', loadChildren: './tab1/delete-category/delete-category.page.module#DeleteCategoryPageModule' }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
