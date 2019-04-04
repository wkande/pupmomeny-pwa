import { Component, OnInit } from '@angular/core';
import { UpsertExpensePage } from '../../../tab1/expenses/upsert-expense/upsert-expense.page';
import { ModalController, Events } from '@ionic/angular';


@Component({
  selector: 'expense-fab-component',
  templateUrl: './expense-fab.component.html',
  styleUrls: ['./expense-fab.component.scss'],
})
export class ExpenseFabComponent implements OnInit {

  constructor(private modalController:ModalController, private events:Events) { }

  ngOnInit() {}



  async presentExpenseUpsertModal(ev:any) {
    try{

        console.log('ExpenseFabComponent:presentUpsertModal()')
        const modal = await this.modalController.create({
          component: UpsertExpensePage,
          componentProps: { expense: null, mode:"insert" },
          backdropDismiss:false
        });
        await modal.present();
        
        const { data } = await modal.onDidDismiss();
        console.log('ExpenseFabComponent:presentUpsertModal():dismissed: data',data);

        // Reload
        if(data != null){
          //this.filter = this.filterService.getFilter();
          //this.getExpenses();
        }
    }
    catch(err){
      console.log(err);
    } 
  }


}
