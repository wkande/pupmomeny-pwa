import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VendorsComponent } from './vendors.component';
import { IonicModule } from '@ionic/angular';

// Example usage for ionic components
// https://www.youtube.com/watch?v=za5NaFavux4


@NgModule({
  declarations: [
    VendorsComponent
  ],
  imports:[IonicModule, CommonModule, FormsModule],
  exports: [VendorsComponent]
})


export class VendorsComponentModule {}