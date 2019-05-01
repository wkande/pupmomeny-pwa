import { Component, OnInit, Input } from '@angular/core';
import { ModalController, LoadingController, Events} from '@ionic/angular';
import { HttpClient, HttpHeaders, JsonpInterceptor } from '@angular/common/http';
import { AuthGuard } from '../../services/auth.guard';
import { timeout } from 'rxjs/operators';
import { BACKEND } from '../../../environments/environment';
import { delay } from 'rxjs/internal/operators'; // Testing only
import { UtilsService } from '../../services/utils/utils.service';


@Component({
  selector: 'app-upsert-wallet',
  templateUrl: './upsert-wallet.page.html',
  styleUrls: ['./upsert-wallet.page.scss'],
})


export class UpsertWalletPage implements OnInit {

  @Input("wallet") wallet:any;
  @Input("mode") mode:string;
  title:string;


  error:any;
  showTryAgainBtn:boolean = false;
  ready:boolean = false;
  loading:any;


  constructor(private modalController:ModalController,
    private http:HttpClient, private authGuard:AuthGuard, private loadingController:LoadingController,
    private utils:UtilsService, private events:Events) { 
  }


  ngOnInit() {
      try{
        console.log('UpsertWalletPage ngOnInit', this.wallet, this.mode);
        // The wallet will be null for inserts
        this.title = ((this.wallet == null) ? 'Add Wallet' : 'Edit Wallet');
        
        if(!this.wallet){
          // Need a name for the html input binding
          // The currency component needs a currency 
          this.wallet = {name:null, currency:{"curId":2, "symbol":"", "separator":",", "decimal":".", "precision": 2}};
        }
        
        this.ready = true;
      }
      catch(err){
        this.showTryAgainBtn = false;
        this.error = err;
      }
  }


  cancel(){
      this.modalController.dismiss(null)
  } 

/**
 * Called by the currency component when the user changes the currency format.
 * @param ev 
 */
  selectedCurrency(ev:any){
      console.log('UpsertWalletPage.selectedCurrency.ev', ev);
      this.wallet.currency = ev;
      console.log('this.wallet', this.wallet)
  }


  async apply(ev:any) {
      try{

          if(this.wallet.name.length == 0){
            this.error = 'Please enter a category name.';
            return;
          }
          await this.presentLoading(); // wait for it so it exists, otherwise it may still be null when finally runs

          this.error = null;
          this.showTryAgainBtn = false;

          let headers = new HttpHeaders();
          headers = headers.set('Authorization', 'Bearer '+this.authGuard.getUser()['token']);
          headers = headers.set('wallet',  JSON.stringify(this.wallet));

          let result:any;
          if(this.mode == 'insert'){
            result = await this.http.post(BACKEND.url+'/wallets', 
              {name:this.wallet.name, shares:'{}', currency:this.wallet.currency}, {headers: headers} ).pipe(timeout(5000), delay (this.utils.delayTimer)).toPromise();
          }
          else{
            result = await this.http.patch(BACKEND.url+'/wallets/'+this.wallet.id, 
              {name:this.wallet.name, shares:'{}', currency:this.wallet.currency}, {headers: headers} ).pipe(timeout(5000), delay (this.utils.delayTimer)).toPromise();
          }

          this.wallet = result.wallet;
          await localStorage.setItem('wallet', JSON.stringify(this.wallet));

          // The user's wallet list is not up-to-date in the token
          var userData:any = await this.http.get(BACKEND.url+'/user', {headers: headers} ).pipe(timeout(5000), delay (this.utils.delayTimer)).toPromise();
          this.authGuard.setUser(userData.user); // authGuard will update localstorage
          
          this.events.publish('wallet_reload', {});
          this.events.publish('redraw', {wallet:this.wallet, mode:this.mode});
          this.modalController.dismiss( {mode:this.mode, wallet:this.wallet});
      }
      catch(err){
        if(JSON.stringify(err).indexOf('duplicate key value') != -1){
          this.error = 'That wallet name is already in use. Please enter a different one.';
        }
        else{
          this.showTryAgainBtn = true;
          this.error = err;
        }
        
      }
      finally{
        this.loading.dismiss();
      }
  };


  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Submitting changes, please wait...',
      keyboardClose:true,
      showBackdrop:true
    });
    await this.loading.present();

  }

}
