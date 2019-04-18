import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, Events } from '@ionic/angular';
import { UpsertExpensePage } from '../upsert-expense/upsert-expense.page';
import { DeleteExpensePage } from '../delete-expense/delete-expense.page';
import { Location } from '@angular/common';
import * as currency from 'currency.js';


@Component({
  selector: 'app-expense',
  templateUrl: './expense.page.html',
  styleUrls: ['./expense.page.scss'],
})


export class ExpensePage implements OnInit {


  wallet:any;
  error:any;
  data:any;
  eventHandler_expenseDML:any; // method to carry "this" into the event handler


  constructor(private router:ActivatedRoute, private modalController:ModalController,
    private events:Events, private _location:Location) { 
    //console.log('>>>>>>>>>>>>>>>> ExpensePage.constructor <<<<<<<<<<<<<<<<<')
  }


  ngOnInit() {
      console.log('>>>>>>>>>>>>>>>> ExpensePage.ngOnInit <<<<<<<<<<<<<<<<<')
      
      try{
          // Get Wallet
          this.wallet = JSON.parse(localStorage.getItem('wallet'));

          console.log('ExpensePage >>>', JSON.parse(this.router.queryParams['_value'].data));

          this.data = JSON.parse(this.router.queryParams['_value'].data);
          this.data.expense.amtDisplay = currency(this.data.expense.amt, this.wallet['currency']).format(true);
    
          // Set back button
          // We want to use the standard back button for/tabs/tab1
          if(this.data.rootTab == '/tabs/tab1') this.data.routerLinkBack = null;
          else this.data.routerLinkBack = this.data.rootTab;
    
          this.eventHandler_expenseDML = this.expenseHandlerDML.bind( this );
          this.events.subscribe('dml', this.eventHandler_expenseDML);
  
          console.log('this.data > final', this.data);
      }
      catch(err){
        this.error = err;
      }
  }


  ngOnDestroy(){
    console.log('>>>>>>>>>>>>>>>> ExpensePage.ngOnDestroy <<<<<<<<<<<<<<<<<')
    this.events.unsubscribe('dml', this.eventHandler_expenseDML);
  }


  /**
   * Event received when an expense is edited or deleted.
   * This event also carries a change to a category but will never get to this view.
   * @param data 
   */
  expenseHandlerDML(data:any){
    try{
      console.log('ExpensePage > expenseHandlerDML > subscribe > dml')
      console.log(data, this.data)

      if(data.expense){ // There must be an expesne object in te data
        if(data.mode === 'delete'){
          console.log('CLOSE')
          this._location.back();
        }
        else if (data.mode === 'edit' && this.data.expense.id === data.expense.id){
            this.data.expense = data.expense;
        }
      } 
    }
    catch(err){
      console.log('loadEvent', err)
      this.error = err;
    }
  }



  async presentUpsertModal(ev:any) {
    try{
        const modal = await this.modalController.create({
          component: UpsertExpensePage,
          componentProps: { expenseParam: this.data.expense, categoryParam:this.data.category, mode:'edit' }
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


  async presentDeleteModal(ev:any) {
    console.log('DELETE')
    try{
        const modal = await this.modalController.create({
          component: DeleteExpensePage,
          componentProps: { expense: this.data.expense, category:this.data.category }
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
