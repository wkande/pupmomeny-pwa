import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ModalController, NavController, Events } from '@ionic/angular';
import { LoginPage } from '../modals/login/login.page';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {


  activated:boolean = false;
  user:object;


  constructor(private modalController: ModalController, private navController:NavController, private events:Events){
    console.log('--> AuthGuard.consructor');
    this.user = JSON.parse(localStorage.getItem( "user"));
    if(this.user){
      this.activated = true;
    }
    //console.log('AuthGuard.constructor(): user', this.user)
  }


  async presentLoginModal() {
    const modal = await this.modalController.create({
      component: LoginPage,
      componentProps: { path: '/tab2' }
    });
    await modal.present();
    //console.log('AuthGuard:presentLoginModal()', 'after await')

    const { data } = await modal.onDidDismiss();
    //console.log('AuthGuard:presentLoginModal():dismissed: data',data);
    this.navController.navigateRoot('');
    return;
  }

  
  getUser(){
    return this.user;
  }

  /**
   * Will activate or deactivate a user. 
   * Called by login modal to activate user.
   * Called by logout in settings to deactivate user.
   * @param flag
   * @param user 
   */
  activate(flag:boolean, user:object){
    this.activated = flag;
    if(!flag){
      localStorage.removeItem( "user");
      // Do not remove the wallet, it will get reused
      this.user = null;
      window.location.reload();
    }
    else{
      localStorage.setItem( "user", JSON.stringify(user));
      // If the wallet is null then set the wallet to the first one in the wallet array which is the user's default wallet
      if(!localStorage.getItem( "wallet")){
        localStorage.setItem( "wallet", JSON.stringify(user['wallets'][0]));
      }
      else{
        let wallet = JSON.parse(localStorage.getItem( "wallet"));
        let flag = false;
        for (var i=0; i< user['wallets'].length; i++){
            if(user['wallets'][i].id == wallet.id){
              flag = true
              //console.log("THE WALLET IS STILL USABLE")
            }
        }
        // The wallet in the storage is no longer allowed set wallet to the default
        if(!flag){
            localStorage.setItem( "wallet", JSON.stringify(user['wallets'][0]));
        }
      }

      this.user = user;
    }
  }


  /**
   * Only gets called by the tabs router when a path get executed.
   * Logout simply reloads the webview which in turns fires the tab router again.
   * 
   * @param next
   * @param state 
   */
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean 
  {
    //console.log('AuthGuard.canActivate.next()', next)
    //console.log('AuthGuard.canActivate.state()', state);
    if(!this.activated){
      this.presentLoginModal();
    }
    return this.activated;
  }
}
