import { NgModule } from '@angular/core';
import { CurrencyComponent } from './currency.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';


// Example usage for ionic components
// https://www.youtube.com/watch?v=za5NaFavux4


@NgModule({
  declarations: [
    CurrencyComponent
  ],
  imports:[IonicModule, FormsModule],
  exports: [CurrencyComponent]
})


export class CurrencyComponentModule {}