import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core'; 
import { UtilsService } from '../../services/utils/utils.service';
import { AuthGuard } from '../../services/auth.guard';


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

  
  @Input() error:any;
  @Input() showButton:boolean = false;
  @Output() tryAgainSelected: EventEmitter<any> = new EventEmitter<any>();
  message:any;

  showLoginBtn:boolean = false;


  constructor(private utils:UtilsService, private authGuard:AuthGuard) { }


  ngOnInit() {
  }


  ngOnChanges(changes: SimpleChanges) {
    //console.log('>>>>>>>>>>>>>> ngOnChange fired.', this.error);
    if(this.error){
      //console.log('ngOnChanges', changes.errorMsg.currentValue);
      //console.log('this.error', this.error)
      this.message = this.utils.getErrorMessage(this.error);
   
      if(this.error.status === 403){
          this.showLoginBtn = true;
      }
    }
    else{
      this.message = null;
    }
  }


  tryAgain(event:any){
    this.tryAgainSelected.emit();
  }


}
