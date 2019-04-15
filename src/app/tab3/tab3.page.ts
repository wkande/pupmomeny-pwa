import { Component } from '@angular/core';
import { AuthGuard } from '../services/auth.guard';
import { ModalController, NavController, Events } from '@ionic/angular';
import { UpdateNamePage } from './update-name/update-name.page';
import { UpdateEmailPage } from './update-email/update-email.page';
import { UtilsService } from '../services/utils/utils.service';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {


  user = {email:null, name:null, sub_expires:null, wallets:null};
  wallet = {name:null};
  errorDisplay:any;
  currencyDisplay:number = 1234.1234;


  constructor(private authGuard:AuthGuard, private modalController:ModalController,
    private utilsService:UtilsService, private http:HttpClient){
    this.user = JSON.parse(localStorage.getItem('user'));
    console.log(this.user)
    this.wallet = JSON.parse(localStorage.getItem('wallet'));
    console.log(this.wallet)
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
