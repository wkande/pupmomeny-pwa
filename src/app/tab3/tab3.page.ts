import { Component } from '@angular/core';
import { AuthGuard } from '../services/auth.guard';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {


  user = {email:null, name:null};
  wallet = {name:null};


  constructor(private authGuard:AuthGuard){
    this.user = JSON.parse(localStorage.getItem('user'));
    this.wallet = JSON.parse(localStorage.getItem('wallet'));
    console.log(this.wallet)
  }


  logout(){
    this.authGuard.activate(false, {});
  }
}
