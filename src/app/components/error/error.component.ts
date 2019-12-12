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
  offline:boolean = false;

  showLoginBtn:boolean = false;


  constructor(private utils:UtilsService, private authGuard:AuthGuard) { }


  ngOnInit() {
  }


  ngOnChanges(changes: SimpleChanges) {
    console.log('>>>>>>>>>>>>>> ErrorComponent.ngOnChange fired.', this.error);
    this.offline = false;
    if(this.error){
      //console.log('ngOnChanges', changes.errorMsg.currentValue);
      //console.log('this.error', this.error)
      this.message = this.utils.getErrorMessage(this.error);
   
      if(this.error.status === 401){
          this.showLoginBtn = true;
      }
      else if(this.error.status === 504){
          this.offline = true;
          this.message = null; //"We are offline making things better."
      }
    }
    else{
      this.message = null;
    }
  }


  tryAgain(event:any){
    console.log('ErrorComponent.tryAgain')
    this.tryAgainSelected.emit();
  }


}
