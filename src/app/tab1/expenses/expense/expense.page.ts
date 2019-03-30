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
  routerLinkBack:string = null;


  constructor(private router:ActivatedRoute) { 
    //console.log('>>>>>>>>>>>>>>>> ExpensePage.constructor <<<<<<<<<<<<<<<<<')

  }


  ngOnInit() {
      console.log('>>>>>>>>>>>>>>>> ExpensePage.ngOnInit <<<<<<<<<<<<<<<<<')
      console.log('ExpensePage ngOnInit > expense', this.expense);
      console.log('ExpensePage:this.router.params', this.router.params)

      // Set back button
      this.routerLinkBack = this.router.params['_value'].rootTab;

      // We want to use the statndar back button for/tabs/tab1
      if(this.routerLinkBack == '/tabs/tab1') this.routerLinkBack = null;

      //if(this.router.params['_value'].rootTab) this.routerLinkBack = '/tabs/tab2';
      console.log('this.routerLinkBack', this.routerLinkBack);

      // Set expense object
      // https://scotch.io/tutorials/handling-route-parameters-in-angular-v2
      this.expense = this.router.params['_value'];
      

      // Get Wallet
      try{
        this.wallet = JSON.parse(localStorage.getItem('wallet'));
      }
      catch(err){
        this.error = err;
      }
  }


  ngOnDestroy(){
    console.log('>>>>>>>>>>>>>>>> ExpensePage.ngOnDestroy <<<<<<<<<<<<<<<<<')

  }


  presentExpenseUpsertModal(expense:any, mode:string){
    ;
  }


  presentExpenseDeleteModal(ev:any){
    ;
  }

}
