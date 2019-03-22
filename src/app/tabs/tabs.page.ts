import { Component } from '@angular/core';
import { BACKEND } from '../../environments/environment';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})



export class TabsPage {

  backend:any = BACKEND;

  constructor(){
    console.log(this.backend.name)
  }




}
