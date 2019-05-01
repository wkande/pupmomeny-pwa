import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UpsertExpensePage } from '../../../tab1/expenses/upsert-expense/upsert-expense.page';
import { ModalController, Events } from '@ionic/angular';


@Component({
  selector: 'expense-fab-component',
  templateUrl: './expense-fab.component.html',
  styleUrls: ['./expense-fab.component.scss'],
})


/** Component to display currency picker. 
  *
  * Usage:
    <expense-fab-component
      (errored)="componentError($event)">
    </expense-fab-component>
  */


export class ExpenseFabComponent implements OnInit {


  constructor(private modalController:ModalController, private events:Events) { }


  @Output() errored: EventEmitter<any> = new EventEmitter<any>();


  ngOnInit() {};


  async presentExpenseUpsertModal(ev:any) {
    try{
        const modal = await this.modalController.create({
          component: UpsertExpensePage,
          componentProps: { expense: null, mode:"insert" },
          backdropDismiss:false
        });
        await modal.present();
        const { data } = await modal.onDidDismiss();
    }
    catch(err){
        this.errored.emit( err.toString() );
    } 
  }


}
