import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { timeout } from 'rxjs/operators';
import { AuthGuard } from '../../services/auth.guard';
import { ModalController, NavController, Events } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FilterPage } from '../../modals/filter/filter.page';
import { FilterService } from '../../services/filter.service';
import { UtilsService } from '../../services/utils/utils.service';
import {Decimal} from 'decimal.js';
import { DeleteExpensePage } from './delete-expense/delete-expense.page';
import { BACKEND } from '../../../environments/environment';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.page.html',
  styleUrls: ['./expenses.page.scss'],
})


export class ExpensesPage implements OnInit {


  category:any;
  wallet:object;
  expenses:any;
  errorDisplay:any;
  loading:boolean = false;
  dttmStart:string;
  dttmEnd:string;
  total:any;
  num:string = "2";
  filter:any;
  skip:number = 0;
  totalCount:number = 0;
  httpError:any;

  eventHandler:any; // method to carry "this" into the event handler

  cur = {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  };

  formatter = new Intl.NumberFormat('en-US', this.cur);


  constructor(private router:ActivatedRoute, private http: HttpClient, private authGuard:AuthGuard, 
    private modalController:ModalController,
    private filterService:FilterService, private events: Events, private navController:NavController,
    private utilsService:UtilsService) { 
    }

    
  ngOnInit() {
      const params:any = this.router.params;
      this.category = params._value;
      // https://scotch.io/tutorials/handling-route-parameters-in-angular-v2
      console.log('ItemsPage ngOnInit', this.category);

      try{
        this.wallet = JSON.parse(localStorage.getItem('wallet'));
        this.filter = this.filterService.getFilter();
        this.getExpenses(); 

        // This round about way keeps the event from firing itself more thatn 
        // once when the view is destroy. Because the removal of the event cannot be done
        // with a promise. And without it will remove it for all views.
        // https://github.com/ionic-team/ionic/issues/13446
        this.eventHandler = this.loadEvent.bind( this );
        this.events.subscribe('filter-changed', this.eventHandler);
      }
      catch(err){
        this.errorDisplay = this.utilsService.getErrorMessage(err);
      }
  }

  
  ngOnDestroy(){
    console.log('ItemsPage ngOnDestroy');
    this.events.unsubscribe('filter-changed', this.eventHandler);
  }

  
  loadEvent(){
    try{
      console.log('ItemsPage > ngOnInit > subscribe > fired > filter-changed')
      console.log(this)
      this.filter = this.filterService.getFilter();
      this.skip = 0;
      this.getExpenses();
    }
    catch(err){
      console.log('loadEvent', err)
      this.errorDisplay = this.utilsService.getErrorMessage(err);
    }
  }


  tryAgain(){
    this.getExpenses();
  }


  async presentFilterModal() {
    const modal = await this.modalController.create({
      component: FilterPage
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    console.log('Tab1Page:presentFilterModal():dismissed');
  }

  getMore(){
    this.skip = this.skip+50;
    this.getExpenses();
  }

  getLess(){
    this.skip = this.skip-50;
    this.getExpenses();
  }

  async getExpenses(){
    try{
      this.expenses = [];
      this.errorDisplay = null;
      this.httpError = null;
      this.loading = true;
      //console.log('--> getExpenseItems: FILTER', this.filter);
      let headers = new HttpHeaders();
      headers = headers.set('Authorization', 'Bearer '+this.authGuard.getUser()['token']);
      headers = headers.set('wallet',  JSON.stringify(this.wallet));
      console.log('--> getExpenses: HEADERS', headers);

    
      let q = this.utilsService.formatQ(  ((this.filter.search.toggle) ? this.filter.search.text : '')  );
      console.log('final q', q)

      var result = await this.http.get(BACKEND.url+'/ategories/'+this.category.id+'/expenses?q='+q
        +'&dttmStart='+this.filter.range.start+'&dttmEnd='+this.filter.range.end+'&skip='+this.skip, 
        {headers: headers})
      .pipe(timeout(5000))
      .toPromise();
      console.log(result)
      this.totalCount = result['totalCount'];
      this.expenses = result['expenses'];
      
      // Get total amt of all expenses
      // floating point arithmetic is not always 100% accurate, use Decimals
      this.total = new Decimal(0);
      for(var i=0; i<this.expenses.length; i++){
        this.total = Decimal.add(this.total, this.expenses[i].amt);
      }
      this.total = parseFloat(this.total.toString());
    }
    catch(err){
      console.log("ERROR getExpenses", err)
      //this.errorDisplay = this.utilsService.getErrorMessage(err);
      this.httpError = err;
    }
    finally{
      this.loading = false;
    }
  }



  async presentDeleteModal(expense:any) {
    try{
        console.log('ExpensesPage:presentDeleteModal()', expense)
        const modal = await this.modalController.create({
          component: DeleteExpensePage,
          componentProps: { expense: expense, category:this.category }
        });
        await modal.present();
        
        const { data } = await modal.onDidDismiss();
        console.log('ExpensesPage:presentDeleteModal():dismissed');

        // Reload
        if(data != null){
          this.filter = this.filterService.getFilter();
          this.getExpenses();
        }
    }
    catch(err){
      this.errorDisplay = this.utilsService.getErrorMessage(err);
    } 
  }


}
