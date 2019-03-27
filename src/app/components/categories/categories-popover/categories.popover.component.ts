import { Component, OnInit } from '@angular/core';
import { CacheService } from '../../../services/cache/cache.service';

@Component({
  selector: 'categories-popover',
  templateUrl: './categories.popover.component.html',
  styleUrls: ['./categories.popover.component.scss'],
})
export class CategoriesPopoverComponent implements OnInit {


    categories:[];


  constructor(private cache:CacheService) { }

  
  ngOnInit() {
    this.categories = this.cache.categories;
    console.log('CategoriesPopoverComponent > ngOnInt > this.categories> ', this.categories);
  }

}
