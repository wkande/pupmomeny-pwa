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


  /*private pad2(numb) {
    return (numb < 10 ? '0' : '') + numb;
  }*/


  private thisMonth(filter:any){
    const start = moment().month(   moment().month()   ).startOf('month').format('YYYY-MM-DD');
    const end = moment().month(   moment().month()   ).endOf('month').format('YYYY-MM-DD');
    return {tag:'This Month', range:{start:start, end:end}, search:{toggle:filter.search.toggle, text:filter.search.text}};
  }

  private lastMonth(filter:any){
    const start = moment().month(   moment().month()-1   ).startOf('month').format('YYYY-MM-DD');
    const end = moment().month(   moment().month()-1   ).endOf('month').format('YYYY-MM-DD');
    return {tag:'Previous Month', range:{start:start, end:end}, search:{toggle:filter.search.toggle, text:filter.search.text}};
  }


  private thisQuarter(filter:any){
    const start = moment().quarter(   moment().quarter()   ).startOf('quarter').format('YYYY-MM-DD');
    const end = moment().quarter(   moment().quarter()   ).endOf('quarter').format('YYYY-MM-DD');
    return {tag:'This Quarter', range:{start:start, end:end}, search:{toggle:filter.search.toggle, text:filter.search.text}};
  }


  private lastQuarter(filter:any){
    const start = moment().quarter(   moment().quarter()-1   ).startOf('quarter').format('YYYY-MM-DD');
    const end = moment().quarter(   moment().quarter()-1   ).endOf('quarter').format('YYYY-MM-DD');
    return {tag:'Previous Quarter', range:{start:start, end:end}, search:{toggle:filter.search.toggle, text:filter.search.text}};
  }


  private thisYear(filter:any){
    const start = moment().year(   moment().year()   ).startOf('year').format('YYYY-MM-DD');
    const end = moment().year(   moment().year()   ).endOf('year').format('YYYY-MM-DD');
    return {tag:'This Year', range:{start:start, end:end}, search:{toggle:filter.search.toggle, text:filter.search.text}};
  }


  private lastYear(filter:any){
    const start = moment().year(   moment().year()-1   ).startOf('year').format('YYYY-MM-DD');
    const end = moment().year(   moment().year()-1   ).endOf('year').format('YYYY-MM-DD');
    return {tag:'Previous Year', range:{start:start, end:end}, search:{toggle:filter.search.toggle, text:filter.search.text}};
  }


  private all(filter:any){
    const start = '1950-01-01'; 
    const end = new Date().getFullYear()+1 +'-12-31';
    return {tag:'All', range:{start:start, end:end}, search:{toggle:filter.search.toggle, text:filter.search.text}};

  }


  private dateRange(filter:any){
    filter.range.start = moment(filter.range.start).format("YYYY-MM-DD");
    filter.range.end = moment(filter.range.end).format("YYYY-MM-DD");
    const startDisplay = moment(filter.range.start).format("MMM DD, YYYY");
    const endDisplay = moment(filter.range.end).format("MMM DD, YYYY");

    return {tag:'Date Range', 
            range:{start:filter.range.start, end:filter.range.end, startDisplay:startDisplay, endDisplay:endDisplay}, 
            search:{toggle:filter.search.toggle, text:filter.search.text}};

  }


}
