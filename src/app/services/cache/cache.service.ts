import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheService {


  categories:[];


  constructor() {
    console.log('------------> CacheService.constructor');
  }

  
  dummy(){

  }


}
