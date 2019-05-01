import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { timeout } from 'rxjs/operators';
import { AuthGuard } from '../../services/auth.guard';
import { ModalController, Events, NavController, Platform } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FilterPage } from '../../modals/filter/filter.page';
import { FilterService } from '../../services/filter.service';
import { UtilsService } from '../../services/utils/utils.service';
//import { Decimal } from 'decimal.js';
import { UpsertExpensePage } from './upsert-expense/upsert-expense.page';
import { DeleteExpensePage } from './delete-expense/delete-expense.page';
import { BACKEND } from '../../../environments/environment';
import { delay } from 'rxjs/internal/operators'; // Testing only
import * as currency from 'currency.js';
import * as moment from 'moment';


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
  totalCount:string;
  error:any;
  ready:boolean = false;
  showButtons:boolean = false;
  // methods to carry "this" into the event handler
  eventHandler_redraw:any; 
  redrawNeeded:boolean = false; // If not the current view hold onto the need to redraw 


  constructor(private routerActivated:ActivatedRoute, private router:Router,
    private http: HttpClient, private authGuard:AuthGuard, 
    private modalController:ModalController, private navCtrl:NavController,
    private filterService:FilterService, private events: Events,
    private utils:UtilsService, private platform:Platform) { 
      //console.log('>>>>>>>>>>>>>>>> ExpensesPage.constructor <<<<<<<<<<<<<<<<<')
    }

    
  ngOnInit() {
      try{
        console.log('>>>>>>>>>>>>>>>> ExpensesPage.ngOnInit <<<<<<<<<<<<<<<<<')
        this.wallet = JSON.parse(localStorage.getItem('wallet'));
        
        this.category.id = this.routerActivated.snapshot.paramMap.get('id');
        this.category.name = this.routerActivated.snapshot.paramMap.get('name');
        this.getExpenses();

        // This round about way keeps the event from firing itself more than 
        // once when the view is destroyed. Because the removal of the event cannot be done
        // with a promise. And without it will remove it for all views.
        // https://github.com/ionic-team/ionic/issues/13446
        this.eventHandler_redraw = this.redrawEventHandler.bind( this );
        this.events.subscribe('redraw', this.eventHandler_redraw);
      }
      catch(err){
        console.log(err);
        this.error = err;
      }
  }


  ionViewDidEnter(){
    this.utils.currentView = 'ExpensesPage';
    console.log('---> ExpensesPage.ionViewDidEnter')
    if(this.redrawNeeded) {
        this.redrawNeeded = false;
        this.tryAgain(null);
    }
  }
  

  ngOnDestroy(){
    console.log('>>>>>>>>>>>>>>>> ExpensesPage.ngOnDestroy <<<<<<<<<<<<<<<<<')
    this.events.unsubscribe('redraw', this.eventHandler_redraw);
  }

  
  redrawEventHandler(){
    try{
      console.log('ExpensesPage > subscribe > fired > redraw')
      this.skip = 0;
      if(this.utils.currentView === 'ExpensesPage') this.tryAgain(null);
      else this.redrawNeeded = true;
    }
    catch(err){
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
  }


  getMore(){
    this.skip = this.skip+50;
    this.getExpenses();
  }


  getLess(){
    this.skip = this.skip-50;
    this.getExpenses();
  }

  goBack(en:any){
    // Tab1Page will no fire ionViewDidEnter() because when a root tab page opens a child
    // and the child closes, root tab pages ignore ionViewDidEnter().
    // Send an event to Tab1Page so it can redraw if needed.
    // The ion-back-btn will cause the return to parent
    this.events.publish('tab1page-redraw-if-needed', {});
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
      console.log('>>> ExpensesPage > getExpenses()')
      this.expenses = [];
      this.error = null;
      this.loading = true;
      this.ready = false;
      this.showButtons = false;
      this.total = 0;

      this.filter = this.filterService.getFilter();
      console.log('Filter >', this.filter)

      let headers = new HttpHeaders();
      headers = headers.set('Authorization', 'Bearer '+this.authGuard.getUser()['token']);
      headers = headers.set('wallet',  JSON.stringify(this.wallet));

      let q = ''; //this.utils.formatQ(  ((this.filter.search.toggle) ? this.filter.search.text : '')  );

      var result = await this.http.get(BACKEND.url+'/categories/'+this.category.id+'/expenses?q='+q
        +'&dttmStart='+this.filter.range.start+'&dttmEnd='+this.filter.range.end+'&skip='+this.skip, {headers: headers})
        .pipe(timeout(5000), delay (this.utils.delayTimer)).toPromise();
 
      this.totalCount = result['totalCount'];
      this.expenses = result['expenses'];

      // Get total amt of all expenses and set the date divider
      for(var i=0; i<this.expenses.length; i++){
        // Total
        this.total = currency(this.total).add( (this.expenses[i].amt) );
        this.expenses[i].amtDisplay = currency(this.expenses[i].amt, this.wallet['currency']).format(true);

        // Date divider
        if(i === 0) this.expenses[i].d = moment(this.expenses[i].dttm).format("MMM DD, YYYY");
        else if (this.expenses[i].dttm == this.expenses[i-1].dttm) this.expenses[i].d = null;
        else this.expenses[i].d = moment(this.expenses[i].dttm).format("MMM DD, YYYY");
      }
      this.total = currency(this.total, this.wallet['currency']).format(true);
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


  async presentUpsertModal(expense:any) {
    try{
      this.error = null;
        let category = {id:expense.c_id, name:expense.c_name};
        const modal = await this.modalController.create({
          component: UpsertExpensePage,
          componentProps: { expenseParam: expense, categoryParam:category }
        });
        await modal.present();
        const { data } = await modal.onDidDismiss();
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
    }
    catch(err){
      this.error = err;
    } 
  }


}
