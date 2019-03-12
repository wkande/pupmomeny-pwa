import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})


export class UtilsService {


  constructor() { 
  }


  getErrorMessage(err){
    console.log('--> OOPS', err);
    console.log('--> OOPS err.status:', err.status)
    console.log('--> OOPS err.name:', err.name)
    console.log('--> OOPS err.statusText:', err.statusText)
    console.log('--> OOPS err.error:', err.error)

    // http errors
    if(err.status === 0)
        return 'Seems to be a connection issue, please try again';
    else if(err.name == 'TimeoutError')
        return 'There was a timeout issue waiting for a response, please wait a moment and try again.';
    else if(typeof err.status != 'undefined')
        return "Error getting data: " +err.status+ " "+err.error.statusMessage;

    // Something other than http errored
    else return "Error getting data: " +err.toString();
  }


}
