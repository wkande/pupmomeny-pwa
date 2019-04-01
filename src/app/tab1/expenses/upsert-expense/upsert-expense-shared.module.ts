
import { NgModule } from '@angular/core';
import {UpsertExpensePage } from './upsert-expense.page';
import { IonicModule } from '@ionic/angular';
import { ErrorModule } from '../../../components/error/error.module';


@NgModule({
    imports:[
      IonicModule,
      ErrorModule
    ],
    declarations: [ UpsertExpensePage ],
    exports: [ UpsertExpensePage ]
  })

export class UpsertExpenseSharedPageModule {}