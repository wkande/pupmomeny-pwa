
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { UpsertExpensePage } from './upsert-expense.page';
import { IonicModule } from '@ionic/angular';
import { ErrorModule } from '../../../components/error/error.module';
import { CategoriesComponentModule } from '../../../components/categories/categories.module';
import { VendorsComponentModule } from '../../../components/vendors/vendors.module';


@NgModule({
    imports:[
      IonicModule,
      ErrorModule,
      FormsModule,
      CategoriesComponentModule,
      VendorsComponentModule
    ],
    declarations: [ UpsertExpensePage ],
    exports: [ UpsertExpensePage ]
  })

export class UpsertExpenseSharedPageModule {}