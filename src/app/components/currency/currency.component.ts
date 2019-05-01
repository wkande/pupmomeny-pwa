import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';


@Component({
  selector: 'currency-component',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss'],
})


/** Component to display currency picker. 
  *
  * Usage:
    <currency-component
      [currency]="currency"
      [showButton]=true
      (selectedCurrency)="selectedCurrency($event)"
      (errored)="componentError($event)">
    </currency-component>
  */


export class CurrencyComponent implements OnInit {


  @Input() currency:any;
  @Output() selectedCurrency: EventEmitter<any> = new EventEmitter<any>();
  @Output() errored: EventEmitter<any> = new EventEmitter<any>();
  curId:string;
  currencies = [
    {"curId":0, "symbol":"", "separator":",", "decimal":".", "precision": 0},
    {"curId":1, "symbol":"", "separator":",", "decimal":".", "precision": 1},
    {"curId":2, "symbol":"", "separator":",", "decimal":".", "precision": 2},
    {"curId":3, "symbol":"", "separator":",", "decimal":".", "precision": 3},
    {"curId":4, "symbol":"", "separator":",", "decimal":".", "precision": 4},
    {"curId":5, "symbol":"", "separator":".", "decimal":",", "precision": 0},
    {"curId":6, "symbol":"", "separator":".", "decimal":",", "precision": 1},
    {"curId":7, "symbol":"", "separator":".", "decimal":",", "precision": 2},
    {"curId":8, "symbol":"", "separator":".", "decimal":",", "precision": 3},
    {"curId":9, "symbol":"", "separator":".", "decimal":",", "precision": 4},
  ];


  constructor() { }


  ngOnInit() {
    try{
        console.log('---> CurrencyComponent.ngOnInit', this.currency);
        this.curId = this.currency.curId.toString();
    }
    catch(err){
        // The setTimout prevents a `ExpressionChangedAfterItHasBeenCheckedError` error for ngOnInit
        // https://blog.angularindepth.com/everything-you-need-to-know-about-the-expressionchangedafterithasbeencheckederror-error-e3fd9ce7dbb4
        setTimeout(() => {
          this.errored.emit( err.toString() );
        });
    }
  }


  selectedRadioBtn(ev:any){
    try{
      this.selectedCurrency.emit( this.currencies[this.curId] );
    }
    catch(err){
      this.errored.emit( err.toString() );
    }
  }


}
