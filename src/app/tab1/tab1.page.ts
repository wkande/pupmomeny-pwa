import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { timeout } from 'rxjs/operators';
import { AuthGuard } from '../services/auth.guard';
import { ModalController, Platform, ActionSheetController, Events } from '@ionic/angular';
import { FilterPage } from '../modals/filter/filter.page';
import { FilterService } from '../services/filter.service';
import {Decimal} from 'decimal.js';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})


export class Tab1Page {
  me:any = {};
  user:any = {};
  wallet:object;
  token:any;
  expenses:any;
  errorDisplay:any;
  loading:boolean = false;
  dttmStart:string;
  dttmEnd:string;
  tag:string;
  segment:string = 'categories';
  total:Decimal;
  num:string = "2";

  cur = {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  };

  formatter = new Intl.NumberFormat('en-US', this.cur);



  constructor(private http: HttpClient, private authGuard:AuthGuard, 
    public actionSheetController: ActionSheetController, private modalController:ModalController,
    private filterService:FilterService, private events: Events) {
  }


  ngOnInit(){
    try{
      this.wallet = JSON.parse(localStorage.getItem('wallet'));
      this.getExpenses( this.filterService.getFilter() ); 

      this.events.subscribe('filter-changed', (data) => {
          try{
            console.log('subscribe> filter-changed')
            this.getExpenses( this.filterService.getFilter() );
          }
          catch(err){
              this.catchError(err)
          }
      });
    }
    catch(err){
        this.catchError(err)
    }
  }


  async presentFilterModal() {
    const modal = await this.modalController.create({
      component: FilterPage
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    console.log('Tab1Page:presentFilterModal():dismissed');
  }


  async getExpenses(filter:any){
    
    try{
      this.expenses = [];
      this.errorDisplay = null;
      this.loading = true;
      console.log('--> getExpenses: FILTER', filter);
      this.tag = filter.tag;
      let headers = new HttpHeaders();
      headers = headers.set('Authorization', 'Bearer '+this.authGuard.getUser()['token']);
      headers = headers.set('wallet',  JSON.stringify(this.wallet));
      console.log('--> getExpenses: HEADERS', headers);

      var result = await this.http.get('http://192.168.0.14:3000/expenses?dttmStart='+filter.start+'&dttmEnd='+filter.end, {headers: headers})
      .pipe(timeout(5000))
      .toPromise();
      //console.log(result['expenses']);
      this.expenses = result['expenses'];

      // Get total amt of all expenses
      this.total = new Decimal(0);
      for(var i=0; i<this.expenses.length; i++){
        // https://www.w3schools.com/js/js_numbers.asp
        // The maximum number of decimals is 17, but floating point arithmetic is not always 100% accurate:
        // To solve the problem above use Decimals
        this.total = Decimal.add(this.total, this.expenses[i].sum.amt);
        //console.log(this.expenses[i].sum.amt, ' > ', this.total);
      }
      //console.log('--------', this.total);
    }
    catch(err){
        this.catchError(err)
    }
    finally{
      this.loading = false;
    }
  }


  catchError(err:any){
      console.log('--> OOPS', err);
      console.log('--> OOPS err.status:', err.status)
      console.log('--> OOPS err.name:', err.name)
      console.log('--> OOPS err.statusText:', err.statusText)
      console.log('--> OOPS err.error:', err.error)

      // http errors
      if(err.status === 0)
          this.errorDisplay = 'Seems to be a connection issue, please try again';
      else if(err.name == 'TimeoutError')
          this.errorDisplay = 'There was a timeout issue waiting for a response, please wait a moment and try again.';
      else if(typeof err.status != 'undefined')
          this.errorDisplay = "Error getting data: " +err.status+ " "+err.error.statusMessage;

      // Something other than http errored
      else this.errorDisplay = "Error getting data: " +err.toString();
  }

}
