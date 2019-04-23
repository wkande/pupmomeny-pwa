import { Component, OnInit } from '@angular/core';
import { timeout } from 'rxjs/operators';
import { AuthGuard } from '../services/auth.guard';
import { ModalController, NavController, Events } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FilterPage } from '../modals/filter/filter.page';
import { FilterService } from '../services/filter.service';
import { UtilsService } from '../services/utils/utils.service';
import { Decimal } from 'decimal.js';
import { UpsertExpensePage } from '../tab1/expenses/upsert-expense/upsert-expense.page';

import { BACKEND } from '../../environments/environment';
import { delay } from 'rxjs/internal/operators'; // Testing only
import * as currency from 'currency.js';
import Chart from 'chart.js';


@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss']
})


export class Tab4Page {
  

  wallet:object;
  categories = [];
  cntTotal:number; // # of transactions
  amtTotal:number; // Vlaue of the transactions
  loading:boolean = false;
  filter:any;
  error:any;
  ready:boolean = false;

  // Chart
  chartData = {labels:[], amts:[]};
  theChart:any;
 
  redrawNeeded:boolean = false; // If not the current view hold onto the need to redraw 

  constructor(private http: HttpClient, private authGuard:AuthGuard, 
    private modalController:ModalController,
    private utils:UtilsService, private navCtrl:NavController, private events:Events,
    private filterService:FilterService) { 
      console.log('>>>>>>>>>>>>>>>> Tab4Page.constructor <<<<<<<<<<<<<<<<<')
  }

    
  async ngOnInit() {

      try{
        console.log('>>>>>>>>>>>>>>>> Tab4Page.ngOnInit <<<<<<<<<<<<<<<<<')
        
        this.wallet = JSON.parse(localStorage.getItem('wallet'));
        await this.initChart()
        this.getCategories();
        this.events.subscribe('redraw', (data) => {
            try{
              console.log('Tab4Page > subscribe > fired > redraw');
              if(this.utils.currentView === 'Tab4Page') this.tryAgain(null);
              else this.redrawNeeded = true;
            }
            catch(err){
              this.error = err;
            }
        });
        this.events.subscribe('dml', (data) => {
            try{
              console.log('Tab4Page > ngOnInit > subscribe > fired > dml');
            }
            catch(err){
              this.error = err;
            }
        });
      }
      catch(err){
          this.error = err;
      }
  }


  ionViewDidEnter(){
      this.utils.currentView = 'Tab4Page'
      console.log('---> Tab4Page.ionViewDidEnter')
      if(this.redrawNeeded === true) {
        this.redrawNeeded = false;
        this.tryAgain(null);
      }
  }


  async getCategories(){
    try{

      this.error = null;
      this.loading = true;
      this.amtTotal = 0;
      this.cntTotal = 0;
      this.categories = [];
      this.chartData = {labels:[], amts:[]}
      this.filter = this.filterService.getFilter();
      
      let headers = new HttpHeaders();
      headers = headers.set('Authorization', 'Bearer '+this.authGuard.getUser()['token']);
      headers = headers.set('wallet',  JSON.stringify(this.wallet));

      let q = this.utils.formatQ(  ((this.filter.search.toggle) ? this.filter.search.text : '')  );
      var result = await this.http.get(BACKEND.url+'/categories?q='+q+'&dttmStart='+this.filter.range.start+'&dttmEnd='+this.filter.range.end, {headers: headers})
      .pipe(timeout(7000), delay (this.utils.delayTimer))
      .toPromise();
      this.categories = result['categories'];

      for(var i=0; i<this.categories.length; i++){
            this.cntTotal += this.categories[i].sum.cnt;

            //@ts-ignore
            this.amtTotal = currency(this.amtTotal).add( (this.categories[i].sum.amt) );
            this.categories[i].amtDisplay = currency(this.categories[i].sum.amt, this.wallet['currency']).format(true);
            this.chartData.labels.push(this.categories[i].name);

            // negative number upset the chart
            if(this.categories[i].sum.amt > 0){
              this.chartData.amts.push(this.categories[i].sum.amt);
            }
            else{
              this.chartData.amts.push(0);
            }
      }
      //@ts-ignore
      this.amtTotal = currency(this.amtTotal, this.wallet['currency']).format(true);
      console.log('CHARTS', this.categories)

      this.redrawChart();
    }
    catch(err){
        this.error = err;
    }
    finally{
        this.loading = false;
    }
  }


  // https://www.htmlgoodies.com/tutorials/colors/article.php/3478961/So-You-Want-A-Basic-Color-Code-Huh.htm
  backgroundColor = [
    'blue','blueviolet','brown','crimson','coral','darkgreen','dodgerblue','gold','gray','lawngreen',
    'goldenrod','magenta','lime','midnightblue','olive','orange','orangered','royalblue', 'sandybrown',
    'steelblue','thistle'
  ];
  
  
  async initChart(){
      let borderColors = ['white'];
      for (let i=0; i> 50; i++){
        borderColors.push('white');
      }
      let backgroundColor = [
        'blue','blueviolet','brown','crimson','coral','darkgreen','dodgerblue','gold','gray','lawngreen',
        'goldenrod','magenta','lime','midnightblue','olive','orange','orangered','royalblue', 'sandybrown',
        'steelblue','thistle'
      ];
      var options = {
        title: {
                  display: true,
                  //@ts-ignore
                  text: this.wallet.name,
                  position: 'bottom'
              }
      };

      let ctx = document.getElementById('myChart');
      this.theChart = new Chart(ctx, 
        {
          type: 'doughnut',
          data: {
            labels: [],
            datasets:[{  
                data: [],
                backgroundColor: this.backgroundColor,
                borderColor: borderColors,
                borderWidth: 1
              }]
          },
          options: options
        });
  }


  redrawChart(){
      this.theChart.data.labels = this.chartData.labels;
      this.theChart.data.datasets[0].data = this.chartData.amts;
      this.theChart.update();
      console.log(this.theChart)
  }


  async tryAgain(ev:any){
    this.getCategories();
  }


  doRefresh(ev:any) {
    console.log('Begin doRefreshoperation');
    this.getCategories();
  }


  async presentFilterModal(ev:any) {
    try{
        const modal = await this.modalController.create({
          component: FilterPage
        });
        await modal.present();

        const { data } = await modal.onDidDismiss();
    }
    catch(err){
      this.error = err;
    } 
  }



}
