import { NgModule } from '@angular/core';
import { LoadingComponent } from './loading.component';
import { IonicModule } from '@ionic/angular';

// Example usage for ionic components
// https://www.youtube.com/watch?v=za5NaFavux4


@NgModule({
  declarations: [
    LoadingComponent
  ],
  imports:[IonicModule],
  exports: [LoadingComponent]
})


export class LoadingModule {}