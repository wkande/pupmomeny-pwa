import { Component, OnInit } from '@angular/core';
import { timeout } from 'rxjs/operators';
import { AuthGuard } from '../services/auth.guard';
import { ModalController, NavController, Events } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UtilsService } from '../services/utils/utils.service';
import { Decimal } from 'decimal.js';
import { UpsertExpensePage } from '../tab1/expenses/upsert-expense/upsert-expense.page';
import { DeleteExpensePage } from '../tab1/expenses/delete-expense/delete-expense.page';
import { BACKEND } from '../../environments/environment';
import { delay } from 'rxjs/internal/operators'; // Testing only
import * as currency from 'currency.js';
import * as moment from 'moment';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})


export class Tab2Page {
  

  wallet:object;
  expenses:any;
  loading:boolean = false;
  showButtons:boolean = false;

  //total:any;
  num:string = "2";
  skip:number = 0;
  totalCount:number = 0;
  error:any;
  searchEvent:any;

  ready:boolean = false;
  redrawNeeded:boolean = false; // If not the current view hold onto the need to redraw 


  constructor(private http: HttpClient, private authGuard:AuthGuard, 
    private modalController:ModalController,
    private utils:UtilsService, private navCtrl:NavController, private events:Events) { 
      console.log('>>>>>>>>>>>>>>>> Tab2Page.constructor <<<<<<<<<<<<<<<<<')
  }

    
  ngOnInit() {
      try{
        console.log('>>>>>>>>>>>>>>>> Tab2Page.ngOnInit <<<<<<<<<<<<<<<<<')
        this.wallet = JSON.parse(localStorage.getItem('wallet'));

        this.events.subscribe('redraw', (data) => {
          try{
            console.log('Tab2Page > subscribe > fired > redraw', data);
            // If this was a filter change do not fire.
            if(data.tag && data.range) return;
            else if(this.utils.currentView === 'Tab2Page') {
              this.redrawNeeded = false;
              this.tryAgain(null);
            }
            else{
              this.redrawNeeded = true;
            }
          }
          catch(err){
            this.error = err;
          }
        });
      }
      catch(err){
        this.error = err;
      }
  }


  ionViewDidEnter(){
    this.utils.currentView = 'Tab2Page';
    console.log('---> Tab2Page.ionViewDidEnter', this.redrawNeeded)
    if(this.redrawNeeded) {
        this.redrawNeeded = false;
        this.tryAgain(null);
    }
  }


  tryAgain(ev:any){
    if(!this.searchEvent) return;
    this.searchExpenses(this.searchEvent);
  }


  getMore(){
    this.skip = this.skip+50;
    this.searchExpenses(this.searchEvent);
  }


  getLess(){
    this.skip = this.skip-50;
    this.searchExpenses(this.searchEvent);
  }


  doRefresh(ev:any) {
    console.log('Begin refresh async operation');
    this.searchExpenses(this.searchEvent);

    setTimeout(() => {
      console.log('Async operation has ended');
      ev.target.complete();
    }, 200);
  }


  startSearch(ev:any){
    this.skip = 0;
    this.searchExpenses(ev);
  }


  async searchExpenses(ev:any){
    
    console.log('>>> TAB2 > searchExpenses', ev.detail.value);
    try{
      this.searchEvent = ev;
      this.expenses = [];
      this.error = null;
      this.ready = false;
      this.loading = true;
      this.showButtons = false;
      this.totalCount = 0;
      if(!ev.detail.value || ev.detail.value === "") return;

      let headers = new HttpHeaders();
      headers = headers.set('Authorization', 'Bearer '+this.authGuard.getUser()['token']);
      headers = headers.set('wallet',  JSON.stringify(this.wallet));

      let q = this.utils.formatQ(ev.detail.value);
      //console.log('final q', q)

      var result = await this.http.get(BACKEND.url+'/expenses/context?q='+q+'&skip='+this.skip, {headers: headers})
        .pipe(timeout(7000), delay (this.utils.delayTimer)).toPromise();
      this.totalCount = result['totalCount'];
      this.expenses = result['expenses'];

      for(let i=0; i<this.expenses.length; i++){
          this.expenses[i].amtDisplay =  currency(this.expenses[i].amt, this.wallet['currency']).format(true);

        // Date divider
        if(i === 0) this.expenses[i].d = moment(this.expenses[i].dttm).format("MMM DD, YYYY");
        else if (this.expenses[i].dttm == this.expenses[i-1].dttm) this.expenses[i].d = null;
        else this.expenses[i].d = moment(this.expenses[i].dttm).format("MMM DD, YYYY");
      }
      console.log(this.expenses)
    }
    catch(err){
      this.error = err;
    }
    finally{
      this.ready = true;
      this.loading = false;
      let self = this;
      // Prevents buttons causing screen flicker
      await setTimeout(function(){
        self.showButtons = true;
      }, 200);

      
    }
  }


  async presentUpsertModalOLD________(expense:any, mode:string) {
    try{
        this.error = null;
        let category = {id:expense.c_id, name:expense.c_name};
        const modal = await this.modalController.create({
          component: UpsertExpensePage,
          componentProps: { expenseParam: expense, categoryParam:category, mode:mode }
        });
        await modal.present();
        const { data } = await modal.onDidDismiss();
    }
    catch(err){
      this.error = err;
    } 
  }

  
  async presentUpsertModal(expense:any) {
    try{
      this.error = null;
        let category = {id:expense.c_id, name:expense.c_name};
        const modal = await this.modalController.create({
          component: UpsertExpensePage,
          componentProps: { expenseParam: expense, categoryParam:category, mode:'edit' }
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
        this.error = null;
        let category = {id:expense.c_id, name:expense.c_name};
        const modal = await this.modalController.create({
          component: DeleteExpensePage,
          componentProps: { expense: expense, category:category }
        });
        await modal.present();
        const { data } = await modal.onDidDismiss();
    }
    catch(err){
      this.error = err;
    } 
  }


}
