import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { timeout } from 'rxjs/operators';
import { AuthGuard } from '../services/auth.guard';
import { ModalController, Events, NavController } from '@ionic/angular';
import { FilterPage } from '../modals/filter/filter.page';
import { FilterService } from '../services/filter.service';
import { UtilsService } from '../services/utils/utils.service';
import { CacheService } from '../services/cache/cache.service';
import { UpsertExpensePage } from './expenses/upsert-expense/upsert-expense.page';
import { DeleteExpensePage } from './expenses/delete-expense/delete-expense.page';
import { UpsertCategoryPage } from './categories/upsert-category/upsert-category.page';
import { DeleteCategoryPage } from './categories/delete-category/delete-category.page';
import { BACKEND } from '../../environments/environment';
import { delay } from 'rxjs/internal/operators'; // Testing only
import * as currency from 'currency.js';
import * as moment from 'moment';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})


export class Tab1Page {
  wallet:object;
  categories:any;
  expenses:any;
  error:any;
  dttmStart:string;
  dttmEnd:string;
  //total:any = 0;
  cntTotal = 0; // Number of transactions
  totalAmt:any;
  num:string = "2";
  filter:any;
  loading:boolean = true;
  ready:boolean = false;
  presentLoader:boolean = true;
  segment:string ="categories";
  skip:number = 0;
  redrawNeeded:boolean = false; // If not the current view hold onto the need to redraw 
  showButtons:boolean = false;


  constructor(private http: HttpClient, private authGuard:AuthGuard, private modalController:ModalController,
    private filterService:FilterService, private events: Events, 
    private utils:UtilsService, private cache:CacheService, private navCtrl:NavController) {
      //console.log('>>>>>>>>>>>>>>>> Tab1Page.constructor <<<<<<<<<<<<<<<<<')
  }


  async ngOnInit(){
    try{
      //console.log('>>>>>>>>>>>>>>>> Tab1Page.ngOnInit <<<<<<<<<<<<<<<<<')
      this.wallet = JSON.parse(localStorage.getItem('wallet'));
      this.getCategories(); 
      this.events.subscribe('redraw', (data) => {
          try{
            console.log('Tab1Page > subscribe > fired > redraw');
            this.redrawNeeded = true;
            if(this.utils.currentView === 'Tab1Page') {
              this.redrawNeeded = false;
              this.tryAgain(null);
            }
          }
          catch(err){
            this.error = err;
          }
      });
      // A message will come from the expenses (child) page that Tab1Page can redraw as ExpensesPage close
      this.events.subscribe('tab1page-redraw-if-needed', (data) => {
          try{
            console.log('Tab1Page > subscribe > fired > tab1page-redraw-if-needed', this.redrawNeeded);
            this.ionViewDidEnter();
          }
          catch(err){
            this.error = err;
          }
      });
      // Current wallet changed
      this.events.subscribe('wallet_reload', (data) => {
          console.log('Tab1Page > subscribe > fired > wallet_reload');
          this.wallet = JSON.parse(localStorage.getItem('wallet'));
      });
    }
    catch(err){
      this.error = err;
    }
  }


  ionViewDidEnter(){
      this.utils.currentView = 'Tab1Page';
      console.log('---> Tab1Page.ionViewDidEnter', this.redrawNeeded)
      if(this.redrawNeeded) {
        this.redrawNeeded = false;
        this.tryAgain(null);
      }
  }


  tryAgain(ev:any){
    if(this.segment === 'list') {
      this.categories = []
      this.getExpenses();
    }
    else if (this.segment == 'categories') {
      this.expenses = [];
      this.getCategories();
    }
  }


  async getCategories(){
    try{
      console.log('Tab1Page.getCategories FIRED')
      this.error = null;
      this.loading = true;
      this.totalAmt = 0;
      this.cntTotal = 0;
      this.categories = [];
      this.showButtons = false;
      this.filter = this.filterService.getFilter();
      
      let headers = new HttpHeaders();
      headers = headers.set('Authorization', 'Bearer '+this.authGuard.getUser()['token']);
      headers = headers.set('wallet',  JSON.stringify(this.wallet));

      let q = this.utils.formatQ(  ((this.filter.search.toggle) ? this.filter.search.text : '')  );
      var result = await this.http.get(BACKEND.url+'/categories?q='+q+'&dttmStart='+this.filter.range.start+'&dttmEnd='+this.filter.range.end, {headers: headers})
      .pipe(timeout(7000), delay(this.utils.delayTimer))
      .toPromise();
      this.categories = result['categories'];
 
      for(var i=0; i<this.categories.length; i++){
        this.cntTotal += this.categories[i].sum.cnt;
        this.totalAmt = currency(this.totalAmt).add( (this.categories[i].sum.amt) );
        this.categories[i].amtDisplay = currency(this.categories[i].sum.amt, this.wallet['currency']).format(true);
      }

      this.totalAmt = currency(this.totalAmt, this.wallet['currency']).format(true);
      this.cache.categories = this.categories;
      
      // Prevents buttons causing screen flicker
      let self = this;
      await setTimeout(function(){
        self.showButtons = true;
      }, 200);
    }
    catch(err){
      console.log('getCategories', err)
      this.error = err;
    }
    finally{
      this.loading = false;
    }
  }


  getMore(ev:any){
    this.skip = this.skip+50;
    this.getExpenses();
  }


  getLess(ev:any){
    this.skip = this.skip-50;
    this.getExpenses();
  }


  async getExpenses(){
    try{
      console.log('>>> TAB1 > getExpenses')
      this.expenses = [];
      this.error = null;
      this.loading = true;
      this.ready = false;
      this.totalAmt = 0;
      this.showButtons = false;

      this.filter = this.filterService.getFilter();

      let headers = new HttpHeaders();
      headers = headers.set('Authorization', 'Bearer '+this.authGuard.getUser()['token']);
      headers = headers.set('wallet',  JSON.stringify(this.wallet));

      let q = ''; //this.utils.formatQ(  ((this.filter.search.toggle) ? this.filter.search.text : '')  );

      var result = await this.http.get(BACKEND.url+'/expenses?q='+q
        +'&dttmStart='+this.filter.range.start+'&dttmEnd='+this.filter.range.end+'&skip='+this.skip, {headers: headers})
        .pipe(timeout(5000), delay (this.utils.delayTimer)).toPromise();
 
      this.cntTotal = result['totalCount'];
      this.expenses = result['expenses'];

      
      // Get total amt of all expenses and set the date divider
      for(var i=0; i<this.expenses.length; i++){
        // Total
        //this.total = currency(this.total).add( (this.expenses[i].amt) );
        this.expenses[i].amtDisplay = currency(this.expenses[i].amt, this.wallet['currency']).format(true);
        this.expenses[i].category = {id:this.expenses[i].c_id, name:this.expenses[i].c_name};

        // Date divider
        if(i === 0) this.expenses[i].d = moment(this.expenses[i].dttm).format("MMM DD, YYYY");
        else if (this.expenses[i].dttm == this.expenses[i-1].dttm) this.expenses[i].d = null;
        else this.expenses[i].d = moment(this.expenses[i].dttm).format("MMM DD, YYYY");
      }
      //this.total = currency(this.total, this.wallet['currency']).format(true);
      this.totalAmt = currency(result['totalAmt'], this.wallet['currency']).format(true);
      this.ready = true;

      // Prevents buttons causing screen flicker
      let self = this;
      await setTimeout(function(){
        self.showButtons = true;
      }, 200);
    }
    catch(err){
      this.error = err;
    }
    finally{
      this.loading = false;
    }
  }


  async presentFilterModal(ev:any) {
      try{
          const modal = await this.modalController.create({
            component: FilterPage
          });
          await modal.present();

          const { data } = await modal.onDidDismiss();
      }
      catch(err){
        this.error = err;
      } 
  }
  

  async presentUpsertExpenseModal(expense:any) {
    try{
      this.error = null;
        let category = {id:expense.c_id, name:expense.c_name};
        const modal = await this.modalController.create({
          component: UpsertExpensePage,
          componentProps: { expenseParam: expense, categoryParam:category, mode:"edit" },
          showBackdrop:true,
          backdropDismiss:false
        });
        await modal.present();
        const { data } = await modal.onDidDismiss();
    }
    catch(err){
      this.error = err;
    } 
  }


  async presentUpsertCategoryModal(category:any, mode:string) {
    try{
        this.error = null;
        const modal = await this.modalController.create({
          component: UpsertCategoryPage,
          componentProps: { category: category, mode:mode },
          showBackdrop:true,
          backdropDismiss:false
        });
        await modal.present();
        
        const { data } = await modal.onDidDismiss();

        // Reload
        if(data != null){
          this.getCategories();
        }
    }
    catch(err){
      this.error = err;
    } 
  }


  async presentDeleteCategoryModal(category:any) {
    try{
        this.error = null;
        const modal = await this.modalController.create({
          component: DeleteCategoryPage,
          componentProps: { category: category, categories:this.categories },
          showBackdrop:true,
          backdropDismiss:false
        });
        await modal.present();
        
        const { data } = await modal.onDidDismiss();
        console.log('Tab1Page:presentDeleteModal():dismissed');

        // Reload
        if(data != null){
          this.getCategories();
        }
    }
    catch(err){
      this.error = err;
    } 
  }

  async presentDeleteModal(expense:any) {
    try{
      console.log('E', expense)
      let category = {id:expense.c_id, name:expense.c_name};
        const modal = await this.modalController.create({
          component: DeleteExpensePage,
          componentProps: { expense: expense, category:category },
          showBackdrop:true,
          backdropDismiss:false
        });
        await modal.present();
        const { data } = await modal.onDidDismiss();
    }
    catch(err){
      this.error = err;
    } 
  }


  doRefresh(event:any) {
    this.getCategories();

    setTimeout(() => {
      event.target.complete();
    }, 200);
  }


  itemSelected(ev:any, item:any){
    this.navCtrl.navigateForward('/expenses/'+item.id+'/'+item.name);
  }


  componentError(ev:any){
    this.error = ev.toString();
  }


}
