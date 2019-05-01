import { Component, OnInit, Input } from '@angular/core';
import { UtilsService } from '../../services/utils/utils.service';
import { ModalController, AlertController, LoadingController, Events} from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthGuard } from '../../services/auth.guard';
import { timeout } from 'rxjs/operators';
import { BACKEND } from '../../../environments/environment';
import { delay } from 'rxjs/internal/operators'; // Testing only


@Component({
  selector: 'app-delete-wallet',
  templateUrl: './delete-wallet.page.html',
  styleUrls: ['./delete-wallet.page.scss'],
})


export class DeleteWalletPage implements OnInit {


  error:any;
  showTryAgainBtn:boolean = false;
  loadCtlr:any;
  ready:boolean = false;

  @Input("wallet") wallet:any;
 


  constructor(private utils:UtilsService, private modalController:ModalController,
    private http:HttpClient, private authGuard:AuthGuard, private alertController:AlertController,
    private loadingController:LoadingController, private events:Events) { }


  ngOnInit() {
      try{
        console.log('DeleteWalletPage ngOnInit', this.wallet);
        this.ready = true;
      }
      catch(err){
        this.error = err;
      }
  }



  cancel(){
    this.modalController.dismiss(null)
  } 


  async apply() {
    try{
        this.error = null;
        this.showTryAgainBtn = false;

        await this.presentLoading(); // wait for it so it exists, otherwise it may still be null when finally runs

        let headers = new HttpHeaders();
        headers = headers.set('Authorization', 'Bearer '+this.authGuard.getUser()['token']);
        headers = headers.set('wallet',  JSON.stringify(this.wallet));

        var result = await this.http.delete(BACKEND.url+'/wallets/'+this.wallet.id, {headers: headers} )
          .pipe(timeout(5000), delay(this.utils.delayTimer)).toPromise();

        // The user's wallet list is not up-to-date in the token
        var userData:any = await this.http.get(BACKEND.url+'/user', {headers: headers} ).pipe(timeout(5000), delay (this.utils.delayTimer)).toPromise();
        this.authGuard.setUser(userData.user); // authGuard will update localstorage

        let currentWallet = JSON.parse(localStorage.getItem('wallet'));
        let user:any = this.authGuard.getUser();

        // If the deleted wallet was the current wallet then set the default wallet as current
        if(currentWallet.id === this.wallet.id){
          for (let i=0; i<user.wallets.length; i++){
              if(user.wallets[i].default_wallet === 1){ //There is only one default wallet per user
                  localStorage.setItem('wallet', JSON.stringify( user.wallets[i] ));
                  this.events.publish('wallet_reload', {});
                  this.events.publish('redraw', {wallet:this.wallet, mode:'delete'});
              }
          }
        }
        else{
          this.events.publish('wallet_reload', {});
        }
        
        this.modalController.dismiss({wallet:this.wallet});
    }
    catch(err){
        this.error = err;
        this.showTryAgainBtn = true;
    }
    finally{
        this.loadCtlr.dismiss();
    }
  };


  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: 'Are you sure?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            
          }
        }, {
          text: 'Continue',
          handler: () => {
            this.apply();
          }
        }
      ]
    });
    await alert.present();
  }


  async presentLoading() {
    this.loadCtlr = await this.loadingController.create({
      message: 'Deleting, please wait...',
      keyboardClose:true,
      showBackdrop:true
    });
    await this.loadCtlr.present();

  }

}
