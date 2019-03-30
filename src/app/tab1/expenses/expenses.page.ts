import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { timeout } from 'rxjs/operators';
import { AuthGuard } from '../../services/auth.guard';
import { ModalController, NavController, Events, ActionSheetController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FilterPage } from '../../modals/filter/filter.page';
import { FilterService } from '../../services/filter.service';
import { UtilsService } from '../../services/utils/utils.service';
import { Decimal } from 'decimal.js';
import { UpsertExpensePage } from './upsert-expense/upsert-expense.page';
import { DeleteExpensePage } from './delete-expense/delete-expense.page';
import { BACKEND } from '../../../environments/environment';
import { delay } from 'rxjs/internal/operators'; // Testing only


@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.page.html',
  styleUrls: ['./expenses.page.scss'],
})


export class ExpensesPage implements OnInit {


  category:any = {}; // Will be null when the view is in search mode
  wallet:object;
  expenses:any;
  loading:boolean = false;
  dttmStart:string;
  dttmEnd:string;
  total:any;
  num:string = "2";
  filter:any;
  skip:number = 0;
  totalCount:number = 0;
  error:any;
  searchEvent:any;

  ready:boolean = false;


  eventHandler:any; // method to carry "this" into the event handler


  constructor(private router:ActivatedRoute, private http: HttpClient, private authGuard:AuthGuard, 
    private modalController:ModalController,
    private filterService:FilterService, private events: Events, private navController:NavController,
    private utils:UtilsService, private actionSheetController:ActionSheetController) { 

      console.log('>>>>>>>>>>>>>>>> ExpensesPage.constructor <<<<<<<<<<<<<<<<<')
    }

    
  ngOnInit() {
      try{
        console.log('>>>>>>>>>>>>>>>> ExpensesPage.ngOnInit <<<<<<<<<<<<<<<<<')
        this.wallet = JSON.parse(localStorage.getItem('wallet'));
        this.filter = this.filterService.getFilter();

        const params:any = this.router.params;

        this.category = params._value;
        this.getExpenses();

        // This round about way keeps the event from firing itself more than 
        // once when the view is destroyed. Because the removal of the event cannot be done
        // with a promise. And without it will remove it for all views.
        // https://github.com/ionic-team/ionic/issues/13446
        this.eventHandler = this.loadEvent.bind( this );
        this.events.subscribe('filter-changed', this.eventHandler);

      
        // https://scotch.io/tutorials/handling-route-parameters-in-angular-v2
        console.log('ExpensesPage this.router.params', this.router.params);
      }
      catch(err){
        this.error = err;
      }
  }

  
  ngOnDestroy(){
    console.log('>>>>>>>>>>>>>>>> ExpensesPage.ngOnDestroy <<<<<<<<<<<<<<<<<')
    this.events.unsubscribe('filter-changed', this.eventHandler);
  }

  
  loadEvent(){
    try{
      console.log('ExpensesPage > loadEvent > subscribe > fired > filter-changed')
      console.log(this)
      this.filter = this.filterService.getFilter();
      this.skip = 0;
      this.getExpenses();
    }
    catch(err){
      console.log('loadEvent', err)
      this.error = err;
    }
  }


  tryAgain(ev:any){
    this.getExpenses();
  }


  async presentFilterModal(ev:any) {
    const modal = await this.modalController.create({
      component: FilterPage
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    console.log('ExpensesPage:presentFilterModal():dismissed');
  }


  getMore(){
    this.skip = this.skip+50;
    this.getExpenses();
  }


  getLess(){
    this.skip = this.skip-50;
    this.getExpenses();
  }



  doRefresh(event) {
    console.log('Begin refresh async operation');
    this.getExpenses();

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 200);
  }


  async getExpenses(){
    console.log('>>> GET > getExpenses')
    try{
      this.expenses = [];
      this.error = null;
      this.loading = true;

      let headers = new HttpHeaders();
      headers = headers.set('Authorization', 'Bearer '+this.authGuard.getUser()['token']);
      headers = headers.set('wallet',  JSON.stringify(this.wallet));
      //console.log('--> getExpenses: HEADERS', headers);

    
      let q = this.utils.formatQ(  ((this.filter.search.toggle) ? this.filter.search.text : '')  );
      console.log('final q', q)

      var result = await this.http.get(BACKEND.url+'/categories/'+this.category.id+'/expenses?q='+q
        +'&dttmStart='+this.filter.range.start+'&dttmEnd='+this.filter.range.end+'&skip='+this.skip, {headers: headers})
        .pipe(timeout(5000), delay (this.utils.delayTimer)).toPromise();
 
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
      this.error = err;
    }
    finally{
      this.loading = false;
    }
  }


  /*
  startSearch(ev:any){
    this.skip = 0;
    this.searchExpenses(ev);
  }

  
  async searchExpenses(ev:any){
    console.log('>>> SEARCH > searchExpenses', ev.detail.value)
    try{
      this.searchEvent = ev;
      this.expenses = [];
      this.error = null;
      this.loading = true;

      let headers = new HttpHeaders();
      headers = headers.set('Authorization', 'Bearer '+this.authGuard.getUser()['token']);
      headers = headers.set('wallet',  JSON.stringify(this.wallet));
      //console.log('--> searchExpenses: HEADERS', headers);

      let q = ev.detail.value;
      //let q = this.utils.formatQ(  ((this.filter.search.toggle) ? this.filter.search.text : '')  );
      console.log('final q', q)

      var result = await this.http.get(BACKEND.url+'/expenses/context?q='+q+'&skip='+this.skip, {headers: headers})
        .pipe(timeout(5000), delay (this.utils.delayTimer)).toPromise();
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
      this.loading = false;
      console.log("ERROR searchExpenses", err)
      this.error = err;
    }
    finally{
      this.loading = false;
    }
  }*/


  
  async presentUpsertModal(expense:any) {
    try{
        const modal = await this.modalController.create({
          component: UpsertExpensePage,
          componentProps: { expenseParam: expense, categoryParam:this.category, mode:'edit' }
        });
        await modal.present();
        const { data } = await modal.onDidDismiss();

        // Reload
        if(data != null){
          // @TODO need to update list;
          //
          //
          //
        }
    }
    catch(err){
      this.error = err;
    } 
  }


  async presentDeleteModal(expense:any) {
    try{
        const modal = await this.modalController.create({
          component: DeleteExpensePage,
          componentProps: { expense: expense, category:this.category }
        });
        await modal.present();
        const { data } = await modal.onDidDismiss();

        // Reload
        if(data != null){
          // @TODO need to delete from list;
          //
          //
          //
        }
    }
    catch(err){
      this.error = err;
    } 
  }


}
