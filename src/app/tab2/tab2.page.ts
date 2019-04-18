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


  eventHandler:any; // method to carry "this" into the event handler


  constructor(private http: HttpClient, private authGuard:AuthGuard, 
    private modalController:ModalController,
    private utils:UtilsService, private navCtrl:NavController, private events:Events) { 
      console.log('>>>>>>>>>>>>>>>> Tab2Page.constructor <<<<<<<<<<<<<<<<<')
  }

    
  ngOnInit() {
      try{
        console.log('>>>>>>>>>>>>>>>> Tab2Page.ngOnInit <<<<<<<<<<<<<<<<<')
        this.wallet = JSON.parse(localStorage.getItem('wallet'));
      }
      catch(err){
        this.error = err;
      }
      this.events.subscribe('dml', (data) => {
        try{
          console.log('Tab2Page > ngOnInit > subscribe > fired > dml');
          this.searchExpenses(this.searchEvent);
        }
        catch(err){
          this.error = err;
        }
    });
  }


  tryAgain(ev:any){
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
    console.log('>>> TAB2 > searchExpenses', ev.detail.value)
    try{
      this.searchEvent = ev;
      this.expenses = [];
      this.error = null;
      this.ready = false;
      this.loading = true;
      this.showButtons = false;
      //this.totalCount = 0;

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


  async presentUpsertModal(expense:any, mode:string) {
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
