import { Component, OnInit, Input } from '@angular/core';
import { ModalController, LoadingController, Events} from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
        if(!this.wallet){
          this.wallet = {name:null};
        }
        console.log('UpsertWalletPage ngOnInit', this.wallet, this.mode);
        this.title = ((this.wallet == null) ? 'Add Wallet' : 'Edit Wallet');
        //if(this.mode == 'edit') this.nameInput.nativeElement.value = this.wallet.name;
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


  async apply(ev:any) {
      try{
      // TEMP UNTILL COMP IS BUILT
      let currency = '{"curId": 2, "symbol": "", "decimal": ".", "precision": 2, "separator": ","}';
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

          if(this.mode == 'insert'){
            var result = await this.http.post(BACKEND.url+'/wallets', 
              {name:this.wallet.name, shares:'{}', currency:currency}, {headers: headers} ).pipe(timeout(5000), delay (this.utils.delayTimer)).toPromise();
          }
          else{
            var result = await this.http.patch(BACKEND.url+'/wallets/'+this.wallet.id, 
              {name:this.wallet.name, shares:'{}', currency:currency}, {headers: headers} ).pipe(timeout(5000), delay (this.utils.delayTimer)).toPromise();
          }
          //@ts-ignore
          this.wallet = result.wallet;
          console.log(this.wallet)
          this.events.publish('wallet_reload', {});
          this.modalController.dismiss( {mode:this.mode, wallet:this.wallet});
      }
      catch(err){
        this.showTryAgainBtn = true;
        this.error = err;
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
