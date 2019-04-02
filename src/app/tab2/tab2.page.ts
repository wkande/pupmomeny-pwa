import { Component, OnInit } from '@angular/core';
import { timeout } from 'rxjs/operators';
import { AuthGuard } from '../services/auth.guard';
import { ModalController, NavController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UtilsService } from '../services/utils/utils.service';
import { Decimal } from 'decimal.js';
import { UpsertExpensePage } from '../tab1/expenses/upsert-expense/upsert-expense.page';
import { DeleteExpensePage } from '../tab1/expenses/delete-expense/delete-expense.page';
import { BACKEND } from '../../environments/environment';
import { delay } from 'rxjs/internal/operators'; // Testing only
import { ExpensePage } from '../tab1/expenses/expense/expense.page';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})


export class Tab2Page {
  

  wallet:object;
  expenses:any;
  loading:boolean = false;

  total:any;
  num:string = "2";
  skip:number = 0;
  totalCount:number = 0;
  error:any;
  searchEvent:any;

  ready:boolean = false;


  eventHandler:any; // method to carry "this" into the event handler


  constructor(private http: HttpClient, private authGuard:AuthGuard, 
    private modalController:ModalController,
    private utils:UtilsService, private navCtrl:NavController) { 
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


  doRefresh(event) {
    console.log('Begin refresh async operation');
    this.searchExpenses(this.searchEvent);

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 200);
  }


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

      let q = this.utils.formatQ(ev.detail.value);
      //let q = this.utils.formatQ(  ((this.filter.search.toggle) ? this.filter.search.text : '')  );
      console.log('final q', q)

      var result = await this.http.get(BACKEND.url+'/expenses/context?q='+q+'&skip='+this.skip, {headers: headers})
        .pipe(timeout(5000), delay (this.utils.delayTimer)).toPromise();
 console.log(result)
      this.totalCount = result['totalCount'];
      this.expenses = result['expenses'];
      
      
      /*if(!this.isSearch){
        // Get total amt of all expenses
        // floating point arithmetic is not always 100% accurate, use Decimals
        this.total = new Decimal(0);
        for(var i=0; i<this.expenses.length; i++){
          this.total = Decimal.add(this.total, this.expenses[i].amt);
        }
        this.total = parseFloat(this.total.toString());
      }*/
      
    }
    catch(err){
      this.loading = false;
      console.log("ERROR searchExpenses", err)
      this.error = err;
    }
    finally{
      this.loading = false;
    }
  }


  async presentUpsertModal(expense:any, mode:string) {
    try{
        this.error = null;
        
        let category = {id:expense.c_id, name:expense.c_name};
        //console.log('Tab2Page:presentUpsertModal()', expense, category);
        const modal = await this.modalController.create({
          component: UpsertExpensePage,
          componentProps: { expenseParam: expense, categoryParam:category, mode:mode }
          // componentProps: { expenseParam: expense, categoryParam:this.category, mode:'edit' }
        });
        await modal.present();
        
        const { data } = await modal.onDidDismiss();
        console.log('Tab2Page:presentUpsertModal():dismissed: data',data);

        // Reload
        if(data != null){
          this.searchExpenses(this.searchEvent);
        }
    }
    catch(err){
      this.error = err;
    } 
  }


  async presentDeleteModal(expense:any) {
    try{
        let category = {id:expense.c_id, name:expense.c_name};
        const modal = await this.modalController.create({
          component: DeleteExpensePage,
          componentProps: { expense: expense, category:category }
          
        });
        await modal.present();
        const { data } = await modal.onDidDismiss();

        // Reload
        if(data != null){
          this.searchExpenses(this.searchEvent);
        }
    }
    catch(err){
      this.error = err;
    } 
  }


  /*click(ev:any, exp:any){
    console.log(exp)
    this.navCtrl.navigateForward(['/expense/12', exp]);
  }*/

}
