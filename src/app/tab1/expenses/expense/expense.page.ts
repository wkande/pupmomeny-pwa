import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BACKEND } from '../../../../environments/environment';
import { delay } from 'rxjs/internal/operators'; // Testing only

@Component({
  selector: 'app-expense',
  templateUrl: './expense.page.html',
  styleUrls: ['./expense.page.scss'],
})
export class ExpensePage implements OnInit {


  wallet:any;
  expense:any;
  error:any;


  constructor(private router:ActivatedRoute) { }

  ngOnInit() {
    console.log('ExpensePage:this.router.params', this.router.params)
      const params:any = this.router.params;
      this.expense = params._value;
      // https://scotch.io/tutorials/handling-route-parameters-in-angular-v2
      console.log('ItemsPage ngOnInit', this.expense);

      try{
        this.wallet = JSON.parse(localStorage.getItem('wallet'));
      }
      catch(err){
        this.error = err;
      }
  }




  presentExpenseUpsertModal(expense:any, mode:string){
    ;
  }

  presentExpenseDeleteModal(ev:any){
    ;
  }

}
