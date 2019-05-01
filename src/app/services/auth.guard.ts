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
    //console.log('------------> AuthGuard.constructor');
    this.user = JSON.parse(localStorage.getItem( "user"));
    if(this.user){
      this.activated = true;
    }
  }


  async presentLoginModal() {
    console.log('AuthGuard:presentLoginModal()')
    const modal = await this.modalController.create({
      component: LoginPage,
      componentProps: { path: '/tab1' },
      showBackdrop:true,
      backdropDismiss:false
    });
    await modal.present();
    
    const { data } = await modal.onDidDismiss();
    //console.log('AuthGuard:presentLoginModal():dismissed: data',data);
    this.navController.navigateRoot('');
    return;
  }

  
  getUser(){
    return this.user;
  }


  setUser(user:any){
    this.user = user;
    localStorage.setItem('user', JSON.stringify(user));
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
      localStorage.removeItem( "wallet");
      this.user = null;
      window.location.reload();
    }
    else{
      // Set the wallet to the user's default wallet.
      let walletFoundFLag:boolean = false;
      for (var i=0; i< user['wallets'].length; i++){
          if(user['wallets'][i].default_wallet == 1 && user['id'] == user['wallets'][i].owner_id){
            localStorage.setItem( "wallet", JSON.stringify(user['wallets'][i]));
            walletFoundFLag = true;
          }
      }
      if(!walletFoundFLag) throw "No default wallet found. Please report this issue to supportme@pupmoney.com.";
      // Only set user if there is a default wallet
      localStorage.setItem( "user", JSON.stringify(user));
      this.user = user;
    }
  }


  /**
   * Only gets called by the tabs router when a path gets executed.
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
