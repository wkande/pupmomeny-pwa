import { Component } from '@angular/core';
import { AuthGuard } from '../services/auth.guard';
import { ModalController, Events, LoadingController } from '@ionic/angular';
import { UpdateNamePage } from './update-name/update-name.page';
import { UpdateEmailPage } from './update-email/update-email.page';
import { UpsertWalletPage } from './upsert-wallet/upsert-wallet.page';
import { SwitchWalletPage } from './switch-wallet/switch-wallet.page';
import { DeleteWalletPage } from './delete-wallet/delete-wallet.page';
import { UtilsService } from '../services/utils/utils.service';
import { BACKEND } from '../../environments/environment';
import { timeout } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {


  user = {email:null, name:null, sub_expires:null, wallets:[]};
  wallet = {id:null, name:null, default_wallet:null};
  error:any;
  ready:boolean = false;

  /**
   * 
   * @param authGuard 
   * @param modalController 
   * @param utilsService 
   * @param http 
   */
  constructor(private authGuard:AuthGuard, private modalController:ModalController,
    private utils:UtilsService, private http:HttpClient, private events:Events, private loadingController:LoadingController){
      
      this.wallet = JSON.parse(localStorage.getItem('wallet'));
      console.log(this.wallet)
      if(!this.user || !this.wallet){
          this.authGuard.activate(false, {});
      }
      else{
        this.ready = true;
      }
      // Current wallet changed
      this.events.subscribe('wallet_reload', (data) => {
          console.log('Tab3Page > subscribe > fired > wallet_reload');
          this.user = JSON.parse(localStorage.getItem('user'));
          this.wallet = JSON.parse(localStorage.getItem('wallet'));
      });
  }


  async ionViewWillEnter(){
    console.log('---> Tab3Page.ionViewWillEnter')
    this.utils.currentView = 'Tab3Page';
    // Make sure the user and wallet objects are reloaded each time the user comes to this tab.
    // If not then logout the user.
    if(!this.user || !this.wallet){
        this.authGuard.activate(false, {});
    }
    else{
        // Silently update the user and wallet objects
        try{
          let headers = new HttpHeaders();
          headers = headers.set('Authorization', 'Bearer '+this.authGuard.getUser()['token']);
          headers = headers.set('wallet',  JSON.stringify(this.wallet));
          var result = await this.http.get(BACKEND.url+'/user', {headers: headers}).pipe(timeout(5000)).toPromise();
          this.user = result['user'];
          localStorage.setItem('user', JSON.stringify(this.user));
          this.authGuard.setUser(this.user);
          console.log('SILENT GET USER', this.user)
        }
        catch(err){
          //quiet
          console.log(err)
        }
    }
  }


  // Used to change hide btn and show spinner
  logoutClicked:boolean = false;
  /**
   * Logout the user. Shows a spinner momentarily.
   */
  logout(){
    this.logoutClicked = true;
    // This is to allow the spiiner to show
    setTimeout(() => {
      this.authGuard.activate(false, {});
    }, 200);
  }


  /**
   * Allows the user to change their email address which is also the login ID.
   * @param ev 
   */
  async presentEmailModal(ev:any){
    try{
        console.log('Tab3Page:presentEmailModal()')
        const modal = await this.modalController.create({
          component: UpdateEmailPage
        });
        await modal.present();
        
        const { data } = await modal.onDidDismiss();
        console.log('Tab3Page:presentEmailModal():dismissed: data',data);

        // Reload 
        if(data != null){
          this.user = JSON.parse(localStorage.getItem('user'));
        }
    }
    catch(err){
      this.error = this.utils.getErrorMessage(err);
    } 
  }


  async presentNameModal(ev:any) {
    try{
        console.log('Tab3Page:presentNameModal()')
        const modal = await this.modalController.create({
          component: UpdateNamePage
        });
        await modal.present();
        
        const { data } = await modal.onDidDismiss();
        console.log('Tab3Page:presentNameModal():dismissed: data',data);

        // Reload 
        if(data != null){
          this.user = JSON.parse(localStorage.getItem('user'));
        }
    }
    catch(err){
      this.error = this.utils.getErrorMessage(err);
    } 
  }


  /**
   * Add or update a wallet
   * @param ev 
   * @param wallet 
   * @param mode 
   */
  async presentWalletUpsertModal(ev:any, wallet:any, mode:string) {
    try{
        console.log('Tab3Page:presentWalletUpsertModal()', wallet, mode)
        const modal = await this.modalController.create({
          component: UpsertWalletPage,
          componentProps: { wallet:wallet, mode:mode },
          showBackdrop:true,
          backdropDismiss:false
        });
        await modal.present();
        
        const { data } = await modal.onDidDismiss();
        console.log('Tab3Page:presentWalletUpsertModal():dismissed: data',data);
        // Reload 
        if(data != null){
        }
    }
    catch(err){
      this.error = this.utils.getErrorMessage(err);
    } 
  }


  /**
   * Switch wallet
   * @param ev 
   * @param wallet 
   * @param mode 
   */
  async presentWalletSwitchModal(ev:any) {
    try{
        console.log('Tab3Page:presentWalletSwitchModal()')
        const modal = await this.modalController.create({
          component: SwitchWalletPage,
          showBackdrop:true,
          backdropDismiss:false
        });
        await modal.present();
        
        const { data } = await modal.onDidDismiss();
        console.log('Tab3Page:presentWalletSwitchModal():dismissed: data',data);
       
    }
    catch(err){
      this.error = this.utils.getErrorMessage(err);
    } 
  }


  /**
   * Delete wallet
   * @param ev 
   * @param wallet 
   */
  async presentWalletDeleteModal(ev:any, wallet:any) {
    try{
        console.log('Tab3Page:presentWalletDeleteModal()', wallet)
        const modal = await this.modalController.create({
          component: DeleteWalletPage,
          componentProps: { wallet:wallet },
          showBackdrop:true,
          backdropDismiss:false
        });
        await modal.present();
        const { data } = await modal.onDidDismiss();
    }
    catch(err){
      this.error = this.utils.getErrorMessage(err);
    } 
  }


}
