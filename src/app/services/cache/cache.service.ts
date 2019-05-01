import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class CacheService {


  categories:[];


  constructor() {}


  getVendors(cat_id:number){
    for(let i=0;i<this.categories.length;i++){
        if( cat_id == this.categories[i]['id'] ){
            return this.categories[i]['vendors']
        }
    }
    throw 'Invalid category ID passed to getVendors in cache.';
  }


  /**
   * Updates the vendors array for a category.
   * Needed for the vendor-picker to call when it changes the vendors for a category.
   * 
   * @param cat_id 
   * @param vendors 
   */
  setVendors(cat_id:number, vendors:any){
    for(let i=0;i<this.categories.length;i++){
      if( cat_id == this.categories[i]['id'] ){
        //@ts-ignore
        this.categories[i].vendors = vendors;
        console.log('CacheService > updated vendors array', cat_id)
        return;
      }
    }
    throw 'Invalid category ID passed to setVendors in cache.';
  }
  
}
