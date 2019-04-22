import { Component, OnInit } from '@angular/core';
import { timeout } from 'rxjs/operators';
import { AuthGuard } from '../services/auth.guard';
import { ModalController, NavController, Events } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UtilsService } from '../services/utils/utils.service';
import { Decimal } from 'decimal.js';
import { UpsertExpensePage } from '../tab1/expenses/upsert-expense/upsert-expense.page';
import { DeleteExpensePage } from '../tab1/expenses/delete-expense/delete-expense.page';
import { BACKEND } from '../../environments/environment';
import { delay } from 'rxjs/internal/operators'; // Testing only
import * as currency from 'currency.js';
import Chart from 'chart.js';
//var Chart = require('chart.js');


@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss']
})


export class Tab4Page {
  

  wallet:object;
  expenses:any;
  loading:boolean = false;
  showButtons:boolean = false;

  //total:any;
  num:string = "2";
  skip:number = 0;
  totalCount:number = 0;
  error:any;
  searchEvent:any;

  ready:boolean = false;


  eventHandler:any; // method to carry "this" into the event handler


  constructor(private http: HttpClient, private authGuard:AuthGuard, 
    private modalController:ModalController,
    private utils:UtilsService, private navCtrl:NavController, private events:Events) { 
      console.log('>>>>>>>>>>>>>>>> Tab4Page.constructor <<<<<<<<<<<<<<<<<')
  }

    
  ngOnInit() {

      var ctx = document.getElementById('myChart');

      var options = {
        tooltips: {
                callbacks: {
                    label: function(tooltipItem) {
                        return "$" + Number(tooltipItem.yLabel) + " and so worth it !";
                    }
                }
            },
                title: {
                          display: true,
                          text: 'Ice Cream Truck',
                          position: 'bottom'
                      },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
        };

        
      var myChart = new Chart(ctx, {
          type: 'doughnut',
          data: {
              labels: ['Beauty', 'Charity', 'Home Improvement' ],
              datasets: [{
                  label: '# of Votes',
                  data: [50, 40, 10],
                  backgroundColor: [
                      'rgba(255, 99, 132, 0.2)',
                      'rgba(54, 162, 235, 0.2)',
                      'red'
                  ],
                  borderColor: [
                      'rgba(255, 99, 132, 1)',
                      'rgba(54, 162, 235, 1)',
                      'red'
                  ],
                  borderWidth: 1
              }]
          },
          options: options
      });


      try{
        console.log('>>>>>>>>>>>>>>>> Tab4Page.ngOnInit <<<<<<<<<<<<<<<<<')
        this.wallet = JSON.parse(localStorage.getItem('wallet'));
      }
      catch(err){
        this.error = err;
      }
      this.events.subscribe('dml', (data) => {
        try{
          console.log('Tab4Page > ngOnInit > subscribe > fired > dml');
          
        }
        catch(err){
          this.error = err;
        }
    });
  }



  ionViewDidEnter(){
      console.log('---> Tab4Page.ionViewDidEnter')
  }

  tryAgain(ev:any){
    
  }



  doRefresh(ev:any) {
    console.log('Begin refresh async operation');


    setTimeout(() => {
      console.log('Async operation has ended');
      ev.target.complete();
    }, 200);
  }




 




}
