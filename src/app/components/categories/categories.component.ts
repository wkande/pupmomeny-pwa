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
      (selected)="categorySelected($event)"
      (errored)="componentError($event)">
    </categories-component>
  */


export class CategoriesComponent implements OnInit {

  
  categories:[];
  @Output() selected: EventEmitter<any> = new EventEmitter<any>();
  @Output() errored: EventEmitter<any> = new EventEmitter<any>();


  constructor(private cache:CacheService) { 
    //console.log('>>>>>>>>>>>>>>>> CategoriesComponent.constructor <<<<<<<<<<<<<<<<<')
  }

  
  ngOnInit() {
    
    try{
        //console.log('>>>>>>>>>>>>>>>> CategoriesComponent.ngOnInit <<<<<<<<<<<<<<<<<')
        this.categories = this.cache.categories;
    }
    catch(err){
        // The setTimout prevents a `ExpressionChangedAfterItHasBeenCheckedError` error for ngOnInit
        // https://blog.angularindepth.com/everything-you-need-to-know-about-the-expressionchangedafterithasbeencheckederror-error-e3fd9ce7dbb4
        setTimeout(() => {
          this.errored.emit( err.toString() );
        });
    }
  }


  selectedCategory(ev:any, id:number, name:string, vendors:any){
    try{
        this.selected.emit({id:id, name:name, vendors:vendors});
    }
    catch(err){
        this.errored.emit( err.toString() );
    }
  }


}
