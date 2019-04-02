import { Component, OnInit } from '@angular/core';
import { Events } from '@ionic/angular'
import { CacheService } from '../../../services/cache/cache.service';

@Component({
  selector: 'categories-popover',
  templateUrl: './categories.popover.component.html',
  styleUrls: ['./categories.popover.component.scss'],
})


/** This component is a category picker that gets displayed on the upsert-expenses modal.
 *  Rather that using an Output EventEmitter is uses a standard Event.
 */


export class CategoriesPopoverComponent implements OnInit {


    categories:[];


  constructor(private cache:CacheService, private events:Events) { 
    console.log('>>>>>>>>>>>>>>>> CategoriesPopoverComponent.constructor <<<<<<<<<<<<<<<<<')
  }

  
  ngOnInit() {
    console.log('>>>>>>>>>>>>>>>> CategoriesPopoverComponent.ngOnInit <<<<<<<<<<<<<<<<<')
    this.categories = this.cache.categories;
    console.log('CategoriesPopoverComponent > ngOnInt > this.categories > ', this.categories);
  }


  selectedCategory(ev:any, id:number, name:string, vendors:any){
    console.log(ev, id, name)
    this.events.publish('category-picked', {id:id, name:name, vendors:vendors});
  }

}
