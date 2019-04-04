import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CacheService } from '../../services/cache/cache.service';


@Component({
  selector: 'categories-component',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})


/** This component is a category picker that gets displayed on the upsert-expenses modal.
  *
  * Usage:
    <categories-component
      (selected)="categorySelected($event)">
    </categories-component>
  */


export class CategoriesComponent implements OnInit {

  
  categories:[];
  @Output() selected: EventEmitter<any> = new EventEmitter<any>();


  constructor(private cache:CacheService) { 
    console.log('>>>>>>>>>>>>>>>> CategoriesComponent.constructor <<<<<<<<<<<<<<<<<')
  }

  
  ngOnInit() {
    console.log('>>>>>>>>>>>>>>>> CategoriesComponent.ngOnInit <<<<<<<<<<<<<<<<<')
    this.categories = this.cache.categories;
    //console.log('CategoriesComponent > ngOnInt > this.categories > ', this.categories);
  }


  selectedCategory(ev:any, id:number, name:string, vendors:any){
    console.log(ev, id, name)
    this.selected.emit({id:id, name:name, vendors:vendors});
  }

}
