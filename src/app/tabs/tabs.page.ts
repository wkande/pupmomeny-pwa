import { Component } from '@angular/core';
import { Events } from '@ionic/angular';
import { BACKEND } from '../../environments/environment';


@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})


export class TabsPage {


  backend:any = BACKEND;
  wallet:any;


  constructor(private events:Events){
    this.wallet = JSON.parse(localStorage.getItem('wallet'));

    this.events.subscribe('wallet_reload', (data) => {
        console.log('TabsPage > subscribe > fired > wallet_reload');
        this.wallet = JSON.parse(localStorage.getItem('wallet'));
    });

  }
}
