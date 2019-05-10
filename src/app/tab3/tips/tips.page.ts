import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-tips',
  templateUrl: './tips.page.html',
  styleUrls: ['./tips.page.scss'],
})
export class TipsPage implements OnInit {

  
  slide:number = 1;


  constructor(private modalCtlr:ModalController, private router:Router) {
    localStorage.setItem('tips', 'yes');
  }


  ngOnInit() {
  }


  next(ev:any){
      this.slide++;
  }

  previous(ev:any){
    this.slide--;
}



}
