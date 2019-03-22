import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'msg-component',
  templateUrl: './msg.component.html',
  styleUrls: ['./msg.component.scss'],
})


/** Component to display a message. 
  *
  * Usage:
    <msg-component
      [message]="msg">
    </msg-component>
  */


export class MsgComponent implements OnInit {


  @Input() message:string;



  constructor() { }


  ngOnInit() {}

}
