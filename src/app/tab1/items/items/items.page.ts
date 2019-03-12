import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { timeout } from 'rxjs/operators';
import { AuthGuard } from '../../../services/auth.guard';
import { ModalController, NavController, Events } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FilterPage } from '../../../modals/filter/filter.page';
import { FilterService } from '../../../services/filter.service';
import { UtilsService } from '../../../services/utils/utils.service';
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
    //console.log(this.navParams.get('userParams'))

    const params:any = this.router.params;
    this.category = params._value;
    // https://scotch.io/tutorials/handling-route-parameters-in-angular-v2
    console.log('ngOnInit', params._value);

    try{
      this.wallet = JSON.parse(localStorage.getItem('wallet'));
      this.filter = this.filterService.getFilter();
      this.getExpenseItems(); 

      this.events.subscribe('filter-changed', (data) => {
          try{
            console.log('subscribe> filter-changed')
            this.filter = this.filterService.getFilter();
            this.getExpenseItems();
          }
          catch(err){
            this.errorDisplay = this.utilsService.getErrorMessage(err);
          }
      });
    }
    catch(err){
      this.errorDisplay = this.utilsService.getErrorMessage(err);
    }
  }


  async presentFilterModal() {
    const modal = await this.modalController.create({
      component: FilterPage
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    console.log('Tab1Page:presentFilterModal():dismissed');
  }


  async getExpenseItems(){
    try{
      this.items = [];
      this.errorDisplay = null;
      this.loading = true;
      console.log('--> getExpenseItems: FILTER', this.filter);
      let headers = new HttpHeaders();
      headers = headers.set('Authorization', 'Bearer '+this.authGuard.getUser()['token']);
      headers = headers.set('wallet',  JSON.stringify(this.wallet));
      console.log('--> getExpenseItems: HEADERS', headers);

      var result = await this.http.get('http://192.168.0.14:3000/expenses/'+this.category.id+'/expense-items?dttmStart='+this.filter.start+'&dttmEnd='+this.filter.end, {headers: headers})
      .pipe(timeout(5000))
      .toPromise();
      console.log(result)
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
      this.errorDisplay = this.utilsService.getErrorMessage(err);
    }
    finally{
      this.loading = false;
    }
  }

}
