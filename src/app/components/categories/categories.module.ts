import { NgModule } from '@angular/core';
import {CommonModule } from '@angular/common';
import { CategoriesComponent } from './categories.component';
import { IonicModule } from '@ionic/angular';

// Example usage for ionic components
// https://www.youtube.com/watch?v=za5NaFavux4


@NgModule({
  declarations: [
    CategoriesComponent
  ],
  imports:[IonicModule, CommonModule],
  exports: [CategoriesComponent]
})


export class CategoriesComponentModule {}