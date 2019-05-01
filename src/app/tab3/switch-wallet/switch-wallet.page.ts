import { Component, OnInit } from '@angular/core';
import { ModalController, Events} from '@ionic/angular';


@Component({
  selector: 'app-switch-wallet',
  templateUrl: './switch-wallet.page.html',
  styleUrls: ['./switch-wallet.page.scss'],
})


export class SwitchWalletPage implements OnInit {


  user:any;
  wallet:any;
  error:any;


  constructor(private modalController:ModalController,
      private events:Events) { 
  }


  ngOnInit() {
      try{
        this.user = JSON.parse(localStorage.getItem('user'));
        this.wallet = JSON.parse(localStorage.getItem('wallet'));
      }
      catch(err){
        this.error = err;
      }
  }


  cancel(){
      this.modalController.dismiss(null)
  } 


  setWallet(ev:any, wallet:any){
      console.log('setWallet', wallet, this.wallet)
      this.wallet = wallet;
  }


  async apply(ev:any) {
      try{
          console.log(this.wallet)
          let data = await localStorage.setItem('wallet', JSON.stringify(this.wallet));
          this.events.publish('wallet_reload', {});
          this.events.publish('redraw', {});
          this.modalController.dismiss( {});
      }
      catch(err){
        this.error = err;
      }
  };


}
