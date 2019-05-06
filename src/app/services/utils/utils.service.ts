import { Injectable } from '@angular/core';
import { BACKEND } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})


export class UtilsService {


  delayTimer:number = 0;
  currentView:string;


  constructor() { 
    if(BACKEND.name != 'Dev') this.delayTimer = 0;
  }


  getErrorMessage(err){
    let message = '';

    if(err.status === 0) message += 'There seems to be a connection issue, please try again. ';
    else if(err.name == 'TimeoutError') message+=  'There was a timeout issue waiting for a response, please wait a moment and try again. ';
    else if(typeof err.status != 'undefined'){
      message += "Error: " 
        //if (err.message) msg += err.message;
        //if (err.error && err.error.text) msg += err.text;
        message += err.status+ ": "
        if(err.error) message += (err.error.statusMessage || ' ')+" "+(err.error.statusMsg || ' ');
    }
        
    // Something other than http errored
    else message += err.toString();
    console.log('>>>', message)
    return message;
  }


  /**
   * Formats the search text for a text search in PostgreSQL. The API wil add back the & sign since it is
   * an issue in the URL.
   * @param q 
   */
  formatQ(q:string){
    q = q.replace(/&/g, '');
    q = q.replace(/\\/g, '');
    let arr = q.split(' ');
    let newQ:string = "";
    // Keep rows with a length greater that zero
    for(let i=0; i<arr.length; i++){
        if( arr[i].length > 0 ){
            newQ += arr[i]+" ";
        }
    }
    newQ = newQ.substring(0, newQ.length-1);
    //console.log('newQ', newQ)
    return newQ;
  }


  isValidMailFormat(email){
    var re = /\S+@\S+\.\S+/;
    return(re.test(email));
  }


}
