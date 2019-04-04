import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { UpsertExpensePage } from '../upsert-expense/upsert-expense.page';
import { DeleteExpensePage } from '../delete-expense/delete-expense.page';


@Component({
  selector: 'app-expense',
  templateUrl: './expense.page.html',
  styleUrls: ['./expense.page.scss'],
})


export class ExpensePage implements OnInit {


  wallet:any;
  error:any;
  data:any;


  constructor(private router:ActivatedRoute, private modalController:ModalController) { 
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
          if(this.data.routerLinkBack == '/tabs/tab1') this.data.routerLinkBack = null;
    
    
          // Set expense object
          // https://scotch.io/tutorials/handling-route-parameters-in-angular-v2
          //this.expense = Object.assign({}, this.router.params['_value']); // deep copy
          // If vendor or note was null they got received here as "null" strings.
          // Neeed to convert back to null.
          //if(this.expense.vendor === "null") this.expense.vendor = null;
          //if(this.expense.note === "null") this.expense.note = null;
    
          console.log('this.data > final', this.data);
      }
      catch(err){
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
