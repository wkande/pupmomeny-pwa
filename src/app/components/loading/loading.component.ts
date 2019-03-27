import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'loading-component',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})


/** Component to display an loading message. 
  *
  * Usage:
    <loading-component
      [loading]=true>
    </loading-component>
  */


export class LoadingComponent implements OnInit {


  @Input() loading:boolean = false;

  constructor() { }


  ngOnInit() {}


}
