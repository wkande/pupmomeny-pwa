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
      (selectedCurrency)="selectedCurrency($event)">
    </currency-component>
  */


export class CurrencyComponent implements OnInit {


  @Input() currency:any;
  @Output() selectedCurrency: EventEmitter<any> = new EventEmitter<any>();
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
      console.log('---> CurrencyComponent.ngOnInit', this.currency);
      this.curId = this.currency.curId.toString();
  }


  selectedRadioBtn(ev:any){
    this.selectedCurrency.emit( this.currencies[this.curId] );
  }
}
