import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheService {


  categories:[];


  constructor() {
    //console.log('------------> CacheService.constructor');
  }


  getVendors(id:number){
    for(let i=0;i<this.categories.length;i++){
        if( id == this.categories[i]['id'] ){
            return this.categories[i]['vendors']
        }
    }
    throw 'Invalid ID passed to getVendors in cache.';
  }

}
