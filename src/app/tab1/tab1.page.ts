import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { timeout } from 'rxjs/operators';
import { AuthGuard } from '../services/auth.guard';
import { ModalController, NavController, Events } from '@ionic/angular';
import { FilterPage } from '../modals/filter/filter.page';
import { FilterService } from '../services/filter.service';
import { UtilsService } from '../services/utils/utils.service';
import {Decimal} from 'decimal.js';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})


export class Tab1Page {
  wallet:object;
  expenses:any;
  errorDisplay:any;
  loading:boolean = false;
  dttmStart:string;
  dttmEnd:string;
  total:any;
  num:string = "2";
  filter:any;

  cur = {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  };

  formatter = new Intl.NumberFormat('en-US', this.cur);



  constructor(private http: HttpClient, private authGuard:AuthGuard, private modalController:ModalController,
    private filterService:FilterService, private events: Events, private navController:NavController,
    private utilsService:UtilsService) {
  }


  ngOnInit(){
    try{
      this.wallet = JSON.parse(localStorage.getItem('wallet'));
      this.filter = this.filterService.getFilter();
      this.getExpenses(); 

      this.events.subscribe('filter-changed', (data) => {
          try{
            console.log('subscribe> filter-changed');
            this.filter = this.filterService.getFilter();
            this.getExpenses();
          }
          catch(err){
            this.errorDisplay = this.utilsService.getErrorMessage(err);
          }
      });
    }
    catch(err){
      this.errorDisplay = this.utilsService.getErrorMessage(err);
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


  async getExpenses(){
    try{
      this.expenses = [];
      this.errorDisplay = null;
      this.loading = true;
      console.log('--> getExpenses: FILTER', this.filter);
      let headers = new HttpHeaders();
      headers = headers.set('Authorization', 'Bearer '+this.authGuard.getUser()['token']);
      headers = headers.set('wallet',  JSON.stringify(this.wallet));
      console.log('--> getExpenses: HEADERS', headers);

      let q:string = ''; // cannot be null for the psql function which checks for length
      if(this.filter.searchToggle){
        q = this.filter.text;
      }
      console.log(q)

      var result = await this.http.get('http://192.168.0.14:3000/expenses?q='+q+'&dttmStart='+this.filter.start+'&dttmEnd='+this.filter.end, {headers: headers})
      .pipe(timeout(5000))
      .toPromise();
      this.expenses = result['expenses'];
      // Get total amt of all expenses
      // floating point arithmetic is not always 100% accurate, use Decimals
      this.total = new Decimal(0);
      for(var i=0; i<this.expenses.length; i++){
        this.total = Decimal.add(this.total, this.expenses[i].sum.amt);
      }
      this.total = parseFloat(this.total.toString());

    }
    catch(err){
      this.errorDisplay = this.utilsService.getErrorMessage(err);
    }
    finally{
      this.loading = false;
    }
  }


  showItem(){
    this.navController.navigateForward(['items', {item:'Data you want to send'}]);
  }

}
