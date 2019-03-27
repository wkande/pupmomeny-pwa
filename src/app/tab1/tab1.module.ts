import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';

// ErrorModule child modals use it as well, though they also must declare it.
import { ErrorModule } from '../components/error/error.module';
import { LoadingModule } from '../components/loading/loading.module';

import { UpsertCategoryPage } from './upsert-category/upsert-category.page';
import { DeleteCategoryPage } from './delete-category/delete-category.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ErrorModule,
    LoadingModule,
    RouterModule.forChild([
      { path: '', component: Tab1Page }, 
      { path: '/upsert-category', component: UpsertCategoryPage },
      { path: '/delete-category', component: DeleteCategoryPage }
    ])
  ],
  declarations: [Tab1Page, UpsertCategoryPage, DeleteCategoryPage]
})
export class Tab1PageModule {}
