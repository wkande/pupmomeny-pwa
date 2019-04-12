import { Injectable } from '@angular/core';
import * as moment from 'moment';


@Injectable({
  providedIn: 'root'
})


export class FilterService {


  constructor() { }


  getFilter(){
    try{
      let filter = JSON.parse(localStorage.getItem('filter'));
      // It is possible that the filter got removed from localstorage by the OS or browser
      if(!filter){
          filter =  {tag:'btnThisMonth', range:{start:null, end:null}, search:{toggle:false, text:null}};
          localStorage.setItem("filter", JSON.stringify(filter));
      }

      if(filter.tag == 'btnThisMonth') return(this.thisMonth(filter));
      else if(filter.tag == 'btnLastMonth') return(this.lastMonth(filter));
      else if(filter.tag == 'btnThisQuarter') return(this.thisQuarter(filter));
      else if(filter.tag == 'btnLastQuarter') return(this.lastQuarter(filter));
      else if(filter.tag == 'btnThisYear') return(this.thisYear(filter));
      else if(filter.tag == 'btnLastYear') return(this.lastYear(filter));
      else if(filter.tag == 'btnAll') return(this.all(filter));
      else if(filter.tag == 'btnDateRange') return(this.dateRange(filter));
    }
    catch(err){
      throw err;
    }
  }


  private pad2(numb) {
    return (numb < 10 ? '0' : '') + numb;
  }


  private getCurrentQuarter(){
    var today = new Date();
    var month = today.getMonth();
    var quarter;
    if (month < 4)
      quarter = 1;
    else if (month < 7)
      quarter = 2;
    else if (month < 10)
      quarter = 3;
    else if (month < 13)
      quarter = 4;

    return quarter;
    
  }



  private thisMonth(filter:any){
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), (date.getMonth()) + 1, 0);
    let start = firstDay.getFullYear() +'-'+this.pad2(firstDay.getMonth()+1) +'-'+this.pad2(firstDay.getDate());
    let end = lastDay.getFullYear() +'-'+this.pad2(lastDay.getMonth()+1) +'-'+this.pad2(lastDay.getDate());
    return {tag:'This Month', range:{start:start, end:end}, search:{toggle:filter.search.toggle, text:filter.search.text}};
  }

  private lastMonth(filter:any){
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth()-1, 1);
    var lastDay = new Date(date.getFullYear(), (date.getMonth()-1) + 1, 0);
    let start = firstDay.getFullYear() +'-'+this.pad2(firstDay.getMonth()+1) +'-'+this.pad2(firstDay.getDate());
    let end = lastDay.getFullYear() +'-'+this.pad2(lastDay.getMonth()+1) +'-'+this.pad2(lastDay.getDate());
    return {tag:'Previous Month', range:{start:start, end:end}, search:{toggle:filter.search.toggle, text:filter.search.text}};
  }


  private thisQuarter(filter:any){
    let qtr = this.getCurrentQuarter();
    let dttm = new Date();
    let start:string;
    let end:string;

    if(qtr == 1){ 
      start = dttm.getFullYear() +'-01-01'; 
      end = dttm.getFullYear() +'-03-31';
    }
    else if(qtr == 2){ 
      start = dttm.getFullYear() +'-04-01'; 
      end = dttm.getFullYear() +'-06-30';
    }
    else if(qtr == 3){
      start = dttm.getFullYear() +'-07-01'; 
      end = dttm.getFullYear() +'-09-30';
    }
    else if(qtr == 4){
      start = dttm.getFullYear() +'-10-01'; 
      end = dttm.getFullYear() +'-12-31';
    }
    return {tag:'This Quarter', range:{start:start, end:end}, search:{toggle:filter.search.toggle, text:filter.search.text}};
  }


  private lastQuarter(filter:any){
    let qtr = this.getCurrentQuarter()-1;
    //console.log('lastQuarter', this.getCurrentQuarter()-1)
    let dttm = new Date();
    let start:string;
    let end:string;
    if(qtr == 0){
      start = dttm.getFullYear()-1 +'-10-01'; 
      end = dttm.getFullYear()-1 +'-12-31';
    }
    else if(qtr == 1){ 
      start = dttm.getFullYear() +'-01-01'; 
      end = dttm.getFullYear() +'-03-31';
  }
    else if(qtr == 2){ 
      start = dttm.getFullYear() +'-04-01'; 
      end = dttm.getFullYear() +'-06-30';
    }
    else if(qtr == 3){
      start = dttm.getFullYear() +'-07-01'; 
      end = dttm.getFullYear() +'-09-30';
    }
    return {tag:'Previous Quarter', range:{start:start, end:end}, search:{toggle:filter.search.toggle, text:filter.search.text}};
  }


  private thisYear(filter:any){
    let start = new Date().getFullYear() +'-01-01'; 
    let end = new Date().getFullYear() +'-12-31';
    return {tag:'This Year', range:{start:start, end:end}, search:{toggle:filter.search.toggle, text:filter.search.text}};
  }


  private lastYear(filter:any){
    let start = new Date().getFullYear()-1 +'-01-01'; 
    let end = new Date().getFullYear()-1 +'-12-31';
    return {tag:'Previous Year', range:{start:start, end:end}, search:{toggle:filter.search.toggle, text:filter.search.text}};
  }


  private all(filter:any){
    let start = '1950-01-01'; 
    let end = new Date().getFullYear() +'-12-31';
    return {tag:'All', range:{start:start, end:end}, search:{toggle:filter.search.toggle, text:filter.search.text}};

  }


  private dateRange(filter:any){
    let now = new Date(filter.start)

    let arrStart = filter.range.start.split("-");
    let arrEnd = filter.range.end.split("-");

    let arr = ['01','02','03','04','05','06','07','08','09','10','11','12'];
    let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    for (var i=0; i<arr.length; i++){
        arrStart[1] = arrStart[1].replace(arr[i], months[i]);
        arrEnd[1]   = arrEnd[1].replace(arr[i], months[i]);
    }
    let startDisplay = arrStart[1]+' '+arrStart[2]+', '+arrStart[0];
    let endDisplay = arrEnd[1]+' '+arrEnd[2]+', '+arrEnd[0];
    //console.log('dateRange', startDisplay, endDisplay)

    return {tag:'Date Range', 
            range:{start:filter.range.start, end:filter.range.end, startDisplay:startDisplay, endDisplay:endDisplay}, 
            search:{toggle:filter.search.toggle, text:filter.search.text}};

  }


}
