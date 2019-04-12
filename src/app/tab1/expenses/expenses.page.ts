import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { timeout } from 'rxjs/operators';
import { AuthGuard } from '../../services/auth.guard';
import { ModalController, Events, NavController } from '@ionic/angular';
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
  ready:boolean = false;
  // methods to carry "this" into the event handler
  eventHandler_filterChanged:any; 
  eventHandler_expenseDeleted:any;


  constructor(private routerActivated:ActivatedRoute, private router:Router,
    private http: HttpClient, private authGuard:AuthGuard, 
    private modalController:ModalController, private navCtrl:NavController,
    private filterService:FilterService, private events: Events,
    private utils:UtilsService) { 
      console.log('>>>>>>>>>>>>>>>> ExpensesPage.constructor <<<<<<<<<<<<<<<<<')
    }

    
  ngOnInit() {
      try{
        console.log('>>>>>>>>>>>>>>>> ExpensesPage.ngOnInit <<<<<<<<<<<<<<<<<')
        this.wallet = JSON.parse(localStorage.getItem('wallet'));
        

        // https://scotch.io/tutorials/handling-route-parameters-in-angular-v2
        const params:any = this.routerActivated.params;
        this.category = JSON.parse(JSON.stringify(params._value));
        
        // The vendors are in params._value, each as a key, not the array you would expect.
        // Their key is a number, then come the text keys for things like id, name.
        // This happens because the array got passed in [routerLink]="".
        this.category.vendors = [];
        for (var key in params._value) {
          if (params._value.hasOwnProperty(key)) {
              if(Number(key) > -1){ // The key is the number from the array
                this.category.vendors.push(params._value[key]);
                delete this.category[key]; // Remove the key outside the array
              }
          }
        }
        
        console.log('ExpensesPage > ngOnInit category>', this.category)

        this.getExpenses();

        // This round about way keeps the event from firing itself more than 
        // once when the view is destroyed. Because the removal of the event cannot be done
        // with a promise. And without it will remove it for all views.
        // https://github.com/ionic-team/ionic/issues/13446
        this.eventHandler_filterChanged = this.loadEvent.bind( this );
        this.events.subscribe('filter-changed', this.eventHandler_filterChanged);
        
        this.eventHandler_expenseDeleted = this.expenseDeleted.bind( this );
        this.events.subscribe('expense-deleted', this.eventHandler_expenseDeleted);
      }
      catch(err){
        this.error = err;
      }
  }

  
  ngOnDestroy(){
    console.log('>>>>>>>>>>>>>>>> ExpensesPage.ngOnDestroy <<<<<<<<<<<<<<<<<')
    this.events.unsubscribe('filter-changed', this.eventHandler_filterChanged);
    this.events.unsubscribe('expense-deleted', this.eventHandler_expenseDeleted);
  }

  
  loadEvent(){
    try{
      console.log('ExpensesPage > loadEvent > subscribe > fired > filter-changed')
      this.skip = 0;
      this.getExpenses();
    }
    catch(err){
      console.log('loadEvent', err)
      this.error = err;
    }
  }


  expenseDeleted(data:any){
    console.log('ExpensesPage DELETED', data)
    for (var i=0;i<this.expenses.length; i++){
        if(data.id === this.expenses[i].id){
          var removed = this.expenses.splice(i,1);
          console.log(removed)
        }
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
    try{
      this.expenses = [];
      this.error = null;
      this.loading = true;
      this.ready = false;

      this.filter = this.filterService.getFilter();
        console.log('ExpensesPage.ngOnInit > ',this.filter)

      let headers = new HttpHeaders();
      headers = headers.set('Authorization', 'Bearer '+this.authGuard.getUser()['token']);
      headers = headers.set('wallet',  JSON.stringify(this.wallet));

      let q = this.utils.formatQ(  ((this.filter.search.toggle) ? this.filter.search.text : '')  );

      var result = await this.http.get(BACKEND.url+'/categories/'+this.category.id+'/expenses?q='+q
        +'&dttmStart='+this.filter.range.start+'&dttmEnd='+this.filter.range.end+'&skip='+this.skip, {headers: headers})
        .pipe(timeout(5000), delay (this.utils.delayTimer)).toPromise();
 
      this.totalCount = result['totalCount'];
      this.expenses = result['expenses'];

      console.log('ExpensesPage.getExpenses >',this.expenses)
      
      // Get total amt of all expenses and set the date divider
      // floating point arithmetic is not always 100% accurate, use Decimals
      this.total = new Decimal(0);
      for(var i=0; i<this.expenses.length; i++){
        // Total
        this.total = Decimal.add(this.total, this.expenses[i].amt);

        // Date divider
        if(i === 0) this.expenses[i].d = this.expenses[i].dttm;
        else if (this.expenses[i].dttm == this.expenses[i-1].dttm) this.expenses[i].d = null;
        else this.expenses[i].d = this.expenses[i].dttm;
      }
      this.total = parseFloat(this.total.toString());
      this.ready = true;
    }
    catch(err){
      this.error = err;
    }
    finally{
      this.loading = false;
    }
  }



  
  
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
