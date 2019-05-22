import { Component } from '@angular/core';
import { Events, ToastController, NavController } from '@ionic/angular';
import { BACKEND } from '../../environments/environment';


@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})


export class TabsPage {


  backend:any = BACKEND;
  wallet:any;


  constructor(private events:Events, private toast:ToastController, private navCtrl:NavController){
    this.wallet = JSON.parse(localStorage.getItem('wallet'));

    this.events.subscribe('wallet_reload', (data) => {
        console.log('TabsPage > subscribe > fired > wallet_reload');
        this.wallet = JSON.parse(localStorage.getItem('wallet'));
    });

    // Show slides toast message on new installs
    if(!localStorage.getItem('tips')){
        this.presentToast();
    }
  }


  async presentToast() {
    const toast = await this.toast.create({
      header: 'Quick Tips',
      message: 'Available anytime in the "Settings" tab.',
      position: 'middle',
      color:'dark',
      buttons: [
        {
          text: 'View',
          icon: 'cog',
          handler: () => {
            this.navCtrl.navigateForward('tips');
          }
        }, {
          text: 'Later',
          role: 'cancel',
          handler: () => {
            ;
          }
        }
      ]
    });
    toast.present();
  }
}
