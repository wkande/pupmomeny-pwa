import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab4Page } from './tab4.page';

import { ErrorModule } from '../components/error/error.module';
import { LoadingModule } from '../components/loading/loading.module';



@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ErrorModule,
    LoadingModule,

    RouterModule.forChild([
      { path: '', component: Tab4Page }, 
      //{ path: '/delete-expense', component: DeleteExpensePage },
      //{ path: '/upsert-expense', component: UpsertExpensePage },
    ])
    
  ],
  declarations: [Tab4Page],
  entryComponents: [ ],

})
export class Tab4PageModule {}
