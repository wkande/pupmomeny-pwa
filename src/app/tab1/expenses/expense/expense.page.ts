import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, Events } from '@ionic/angular';
import { UpsertExpensePage } from '../upsert-expense/upsert-expense.page';
import { DeleteExpensePage } from '../delete-expense/delete-expense.page';
import { Location } from '@angular/common';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.page.html',
  styleUrls: ['./expense.page.scss'],
})


export class ExpensePage implements OnInit {


  wallet:any;
  error:any;
  data:any;
  eventHandler_expenseDeleted:any; // method to carry "this" into the event handler


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

          this.data = JSON.parse(this.router.queryParams['_value'].data)
    
          // Set back button
          // We want to use the standard back button for/tabs/tab1
          if(this.data.rootTab == '/tabs/tab1') this.data.routerLinkBack = null;
          else this.data.routerLinkBack = this.data.rootTab;
    
          this.eventHandler_expenseDeleted = this.expenseDeleted.bind( this );
          this.events.subscribe('dml', this.eventHandler_expenseDeleted);
  
          console.log('this.data > final', this.data);
      }
      catch(err){
        this.error = err;
      }
  }


  ngOnDestroy(){
    console.log('>>>>>>>>>>>>>>>> ExpensePage.ngOnDestroy <<<<<<<<<<<<<<<<<')
    this.events.unsubscribe('dml', this.eventHandler_expenseDeleted);
  }


  expenseDeleted(data){
    try{
      console.log('ExpensePage > expenseDeleted > subscribe > dml')
      console.log(data, this.data)
      if(data.id === this.data.expense.id){
          console.log('CLOSE')
          this._location.back();
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
