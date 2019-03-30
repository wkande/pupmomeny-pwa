
import { NgModule } from '@angular/core';
import { DeleteExpensePage } from './delete-expense.page';
import { IonicModule } from '@ionic/angular';
import { ErrorModule } from '../../../components/error/error.module';

@NgModule({
  imports:[
    IonicModule,
    ErrorModule
  ],
    declarations: [ DeleteExpensePage ],
    exports: [ DeleteExpensePage ]
  })

export class DeleteExpenseSharedPageModule {}