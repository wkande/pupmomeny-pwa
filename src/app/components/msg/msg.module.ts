import { NgModule } from '@angular/core';
import { MsgComponent } from './msg.component';
import { IonicModule } from '@ionic/angular';

// Example usage for ionic components
// https://www.youtube.com/watch?v=za5NaFavux4


@NgModule({
  declarations: [
    MsgComponent
  ],
  imports:[IonicModule],
  exports: [MsgComponent]
})


export class MsgModule {}