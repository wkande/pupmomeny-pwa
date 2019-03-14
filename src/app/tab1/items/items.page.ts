import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { timeout } from 'rxjs/operators';
import { AuthGuard } from '../../services/auth.guard';
import { ModalController, NavController, Events } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FilterPage } from '../../modals/filter/filter.page';
import { FilterService } from '../../services/filter.service';
import { UtilsService } from '../../services/utils/utils.service';
import {Decimal} from 'decimal.js';


@Component({
  selector: 'app-items',
  templateUrl: './items.page.html',
  styleUrls: ['./items.page.scss'],
})


export class ItemsPage implements OnInit {


  category:any;
  wallet:object;
  items:any;
  errorDisplay:any;
  loading:boolean = false;
  dttmStart:string;
  dttmEnd:string;
  total:any;
  num:string = "2";
  filter:any;
  skip:number = 0;
  totalCount:number = 0;

  eventHandler:any; // method to carry "this" into the event handler

  cur = {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  };

  formatter = new Intl.NumberFormat('en-US', this.cur);


  constructor(private router:ActivatedRoute, private http: HttpClient, private authGuard:AuthGuard, 
    private modalController:ModalController,
    private filterService:FilterService, private events: Events, private navController:NavController,
    private utilsService:UtilsService) { 
    }

    
  ngOnInit() {
      const params:any = this.router.params;
      this.category = params._value;
      // https://scotch.io/tutorials/handling-route-parameters-in-angular-v2
      console.log('ItemsPage ngOnInit', this.category);

      try{
        this.wallet = JSON.parse(localStorage.getItem('wallet'));
        this.filter = this.filterService.getFilter();
        this.getExpenseItems(); 

        // This round about way keeps the event from firing itself more thatn 
        // once when the view is destroy. Because the removal of the event cannot be done
        // with a promise. And without it will remove it for all views.
        // https://github.com/ionic-team/ionic/issues/13446
        this.eventHandler = this.loadEvent.bind( this );
        this.events.subscribe('filter-changed', this.eventHandler);
      }
      catch(err){
        this.errorDisplay = this.utilsService.getErrorMessage(err);
      }
  }

  
  ngOnDestroy(){
    console.log('ItemsPage ngOnDestroy');
    this.events.unsubscribe('filter-changed', this.eventHandler);
  }

  
  loadEvent(){
    try{
      console.log('ItemsPage > ngOnInit > subscribe > fired > filter-changed')
      console.log(this)
      this.filter = this.filterService.getFilter();
      this.skip = 0;
      this.getExpenseItems();
    }
    catch(err){
      console.log('loadEvent', err)
      this.errorDisplay = this.utilsService.getErrorMessage(err);
    }
  }


  tryAgain(){
    this.getExpenseItems();
  }


  async presentFilterModal() {
    const modal = await this.modalController.create({
      component: FilterPage
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    console.log('Tab1Page:presentFilterModal():dismissed');
  }

  getMore(){
    this.skip = this.skip+50;
    this.getExpenseItems();
  }

  getLess(){
    this.skip = this.skip-50;
    this.getExpenseItems();
  }

  async getExpenseItems(){
    try{
      this.items = [];
      this.errorDisplay = null;
      this.loading = true;
      //console.log('--> getExpenseItems: FILTER', this.filter);
      let headers = new HttpHeaders();
      headers = headers.set('Authorization', 'Bearer '+this.authGuard.getUser()['token']);
      headers = headers.set('wallet',  JSON.stringify(this.wallet));
      console.log('--> getExpenseItems: HEADERS', headers);

    
      let q = this.utilsService.formatQ(  ((this.filter.search.toggle) ? this.filter.search.text : '')  );
      console.log('final q', q)

      var result = await this.http.get('http://192.168.0.14:3000/expenses/'+this.category.id+'/expense-items?q='+q
        +'&dttmStart='+this.filter.range.start+'&dttmEnd='+this.filter.range.end+'&skip='+this.skip, 
        {headers: headers})
      .pipe(timeout(5000))
      .toPromise();

      this.totalCount = result['totalCount'];
      this.items = result['items'];
      
      // Get total amt of all expenses
      // floating point arithmetic is not always 100% accurate, use Decimals
      this.total = new Decimal(0);
      for(var i=0; i<this.items.length; i++){
        this.total = Decimal.add(this.total, this.items[i].amt);
      }
      this.total = parseFloat(this.total.toString());
    }
    catch(err){
      console.log("ERROR getExpenses", err)
      this.errorDisplay = this.utilsService.getErrorMessage(err);
    }
    finally{
      this.loading = false;
    }
  }



}
