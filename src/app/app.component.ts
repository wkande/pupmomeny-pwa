import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { FilterService } from './services/filter.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})


export class AppComponent {


  constructor(
    private platform: Platform,
    private filterSvc:FilterService,
    private toast:ToastController
  ) {
    this.initializeApp();
  }


  initializeApp() {
    this.platform.ready().then(() => {
      // Call the filter service which will create a filter if none exists.
      let filter = this.filterSvc.getFilter();

      // Check if app needs an update
      // this.presentToast();
      console.log('------------------------\nAppComponent > initializeApp')
    });
  }

  
}
