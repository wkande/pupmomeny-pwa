import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';

// ErrorModule child modals use it as well, though they also must declare it.
import { ErrorModule } from '../components/error/error.module';

import { UpsertCategoryPage } from '../tab1/upsert-category/upsert-category.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ErrorModule,
    RouterModule.forChild([{ path: '', component: Tab1Page }, { path: '/upsert-category', component: UpsertCategoryPage }])
  ],
  declarations: [Tab1Page, UpsertCategoryPage,]
})
export class Tab1PageModule {}
