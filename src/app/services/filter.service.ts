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

      if(filter.parent == 'btnThisMonth') return(this.thisMonth());
      else if(filter.parent == 'btnLastMonth') return(this.lastMonth());
      else if(filter.parent == 'btnThisQuarter') return(this.thisQuarter());
      else if(filter.parent == 'btnLastQuarter') return(this.lastQuarter());
      else if(filter.parent == 'btnThisYear') return(this.thisYear());
      else if(filter.parent == 'btnLastYear') return(this.lastYear());
      else if(filter.parent == 'btnAll') return(this.all());
      else if(filter.parent == 'btnDateRange') return(this.dateRange(filter));
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

    console.log('qtr/month', quarter, month)
    return quarter;
    
  }



  private thisMonth(){
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), (date.getMonth()) + 1, 0);
    let start = firstDay.getFullYear() +'-'+this.pad2(firstDay.getMonth()+1) +'-'+this.pad2(firstDay.getDate());
    let end = lastDay.getFullYear() +'-'+this.pad2(lastDay.getMonth()+1) +'-'+this.pad2(lastDay.getDate());
    console.log('FilterService.thisMonth >', start, end)
    //console.log('>>> firstDay', firstDay)
    //console.log('>>> lastDay', lastDay)
    return {tag:'This Month', start:start, end:end};
  }

  private lastMonth(){
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth()-1, 1);
    var lastDay = new Date(date.getFullYear(), (date.getMonth()-1) + 1, 0);
    let start = firstDay.getFullYear() +'-'+this.pad2(firstDay.getMonth()+1) +'-'+this.pad2(firstDay.getDate());
    let end = lastDay.getFullYear() +'-'+this.pad2(lastDay.getMonth()+1) +'-'+this.pad2(lastDay.getDate());
    console.log('FilterService.lastMonth >', start, end)
    //console.log('>>> firstDay', firstDay)
    //console.log('>>> lastDay', lastDay)
    return {tag:'Previous Month', start:start, end:end};
  }


  private thisQuarter(){
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
    return {tag:'This Quarter', start:start, end:end};
  }


  private lastQuarter(){
    let qtr = this.getCurrentQuarter()-1;
    console.log('lastQuarter', this.getCurrentQuarter()-1)
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
    return {tag:'Previous Quarter', start:start, end:end};
  }


  private thisYear(){
    let start = new Date().getFullYear() +'-01-01'; 
    let end = new Date().getFullYear() +'-12-31';
    return {tag:'This Year', start:start, end:end};
  }


  private lastYear(){
    let start = new Date().getFullYear()-1 +'-01-01'; 
    let end = new Date().getFullYear()-1 +'-12-31';
    return {tag:'Previous Year', start:start, end:end};
  }


  private all(){
    return {tag:'Previous Quarter', start:'1950-01-01', end:'2300-12-31'};
  }


  private dateRange(filter:any){
    let now = new Date(filter.start)

    let arrStart = filter.start.split("-");
    let arrEnd = filter.end.split("-");

    let arr = ['01','02','03','04','05','06','07','08','09','10','11','12'];
    let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    for (var i=0; i<arr.length; i++){
        arrStart[1] = arrStart[1].replace("01", months[i]);
        arrEnd[1]   = arrEnd[1].replace("01", months[i]);
    }
    let start = arrStart[1]+' '+arrStart[2]+', '+arrStart[0];
    let end = arrEnd[1]+' '+arrEnd[2]+', '+arrEnd[0];

    return {tag:'Date Range: '+start+' - '+end+'', start:filter.start, end:filter.end};
  }


}
