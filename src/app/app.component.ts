import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})

export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      //this.statusBar.styleDefault();
      this.statusBar.styleBlackOpaque()
      this.splashScreen.hide();

      // Set filter if null
      if(!localStorage.getItem("filter")){
          let filter =  {tag:'btnThisMonth',
                        range:{start:null, end:null}, search:{toggle:false, text:null}};
          localStorage.setItem("filter", JSON.stringify(filter));
      }
      //console.log('AppComponent.initializeApp() > filter >', localStorage.getItem("filter"));
    });
  }
}
