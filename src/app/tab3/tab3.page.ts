import { Component } from '@angular/core';
import { AuthGuard } from '../services/auth.guard';
import { ModalController, NavController, Events } from '@ionic/angular';
import { UpdateNamePage } from './update-name/update-name.page';
import { UpdateEmailPage } from './update-email/update-email.page';
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
  wallet = {name:null, default_wallet:null};
  errorDisplay:any;
  ready:boolean = false;

  /**
   * 
   * @param authGuard 
   * @param modalController 
   * @param utilsService 
   * @param http 
   */
  constructor(private authGuard:AuthGuard, private modalController:ModalController,
    private utilsService:UtilsService, private http:HttpClient){
      
      // Make sure the user and wallet objects are present
      // If not then logout the user
      this.user = JSON.parse(localStorage.getItem('user'));
      this.wallet = JSON.parse(localStorage.getItem('wallet'));
      console.log(this.user)
      console.log(this.wallet)
      if(!this.user || !this.wallet){
          this.authGuard.activate(false, {});
      }
      else{
        this.ready = true;
      }
  }


  async ionViewWillEnter(){
    // Make sure the user and wallet objects are present each time the user comes to this tab
    // If not then logout the user
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
          let user = result['user'];
          console.log('SILENT USER', user)
        }
        catch(err){
          //quiet
          console.log(err)
        }
    }
  }


  logout(){
    this.authGuard.activate(false, {});
  }


  async presentEmailModal(ev){
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
      this.errorDisplay = this.utilsService.getErrorMessage(err);
    } 
  }

  async presentNameModal(ev) {
    try{
        console.log('Tab3Page:presentNameModal()')
        const modal = await this.modalController.create({
          component: UpdateNamePage
        });
        await modal.present();
        
        const { data } = await modal.onDidDismiss();
        console.log('Tab3Page:presentUpsertModal():dismissed: data',data);

        // Reload 
        if(data != null){
          this.user = JSON.parse(localStorage.getItem('user'));
        }
    }
    catch(err){
      this.errorDisplay = this.utilsService.getErrorMessage(err);
    } 
  }
}
