import { NgModule } from '@angular/core';
import { ErrorComponent } from './error.component';
import { IonicModule } from '@ionic/angular';

// Example usage for ionic components
// https://www.youtube.com/watch?v=za5NaFavux4


@NgModule({
  declarations: [
    ErrorComponent
  ],
  imports:[IonicModule],
  exports: [ErrorComponent]
})


export class ErrorModule {}