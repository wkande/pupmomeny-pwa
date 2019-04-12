import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FilterService } from './services/filter.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})


export class AppComponent {


  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private filterSvc:FilterService
  ) {
    this.initializeApp();
  }


  initializeApp() {
    this.platform.ready().then(() => {
      //this.statusBar.styleDefault();
      //this.statusBar.styleBlackOpaque()
      //this.splashScreen.hide();

      // Call the filter service which will create a filter if none exists.
      let filter = this.filterSvc.getFilter();
    });
  }

  
}
