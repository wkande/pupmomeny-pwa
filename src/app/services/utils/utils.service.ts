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
    else if(typeof err.status != 'undefined'){
      return "Error getting data: " +err.status+ " "+(err.error.statusMessage || '')+" "+err.error.statusMsg;
    }
        

    // Something other than http errored
    else return err.toString();
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


}
