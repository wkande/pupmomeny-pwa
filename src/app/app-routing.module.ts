import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
//import { ItemsPage } from './tab1/items/items/item.page'

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'filter', loadChildren: './modals/filter/filter.module#FilterPageModule' },
  { path: 'items/:id/:name', loadChildren: './tab1/items/items.module#ItemsPageModule' }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
