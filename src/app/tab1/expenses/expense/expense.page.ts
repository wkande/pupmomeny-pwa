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
  //fromSearch:boolean = false; // Inbound parameter tells us if coming from tab1 or tab2
  routerLinkBack:string = '/tabs/tab1';


  constructor(private router:ActivatedRoute) { }


  ngOnInit() {
      console.log('ExpensePage:this.router.params', this.router.params)
      const params:any = this.router.params;

      // Set back button
      this.routerLinkBack = this.router.params['_value'].rootTab; // Gives us a string
      //if(this.router.params['_value'].rootTab) this.routerLinkBack = '/tabs/tab2';
      console.log('this.routerLinkBack', this.routerLinkBack);

      // Set expense object
      // https://scotch.io/tutorials/handling-route-parameters-in-angular-v2
      this.expense = params._value;
      console.log('ExpensePage ngOnInit > expense', this.expense);

      // Get Wallet
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
