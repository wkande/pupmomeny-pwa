import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
//import { IonicModule } from '@ionic/angular'; 

@Component({
  selector: 'error-component',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})


/** Component to display an http error. 
  *
  * Usage:
    <error-component
      [error]="yourError"
      [showButton]=true
      (tryAgainSelected)="tryAgain($event)">
    </error-component>
  */


export class ErrorComponent implements OnInit {

  
  @Input() error:string;
  @Input() showButton:boolean = false;
  @Output() tryAgainSelected: EventEmitter<any> = new EventEmitter<any>();
  message:string;


  constructor() { }

  ngOnInit() {
    console.log('34', this.tryAgainSelected)
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.error){
      //console.log('ngOnChanges', changes.errorMsg.currentValue);
      console.log('this.error', this.error)
      this.getErrorMessage(this.error);
    }
    
    // You can also use categoryId.previousValue and 
    // categoryId.firstChange for comparing old and new values

}

  tryAgain(event:any){
    this.tryAgainSelected.emit();
  }

  getErrorMessage(err:any){
    console.log('--> OOPS', err);

    this.message = '';

    if(err.status === 0) this.message += 'Seems to be a connection issue, please try again. ';
    else if(err.name == 'TimeoutError') this.message+=  'There was a timeout issue waiting for a response, please wait a moment and try again. ';
    else if(typeof err.status != 'undefined'){
      this.message += "Error getting data: " 
        //if (err.message) msg += err.message;
        //if (err.error && err.error.text) msg += err.text;
        this.message += err.status+ ": "
        if(err.error) this.message += (err.error.statusMessage || '')+": "+(err.error.statusMsg || '');
    }
        
    // Something other than http errored
    else this.message += err.toString();
    console.log('>>>', this.message)

  }

}
