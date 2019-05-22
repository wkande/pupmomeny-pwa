import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';



@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.page.html',
  styleUrls: ['./subscribe.page.scss'],
})
export class SubscribePage implements OnInit {


  user:any;
  canPay:boolean = false;
  newExpire:string;


  constructor() { }


  ngOnInit() {

      this.user = JSON.parse(localStorage.getItem('user'));
      console.log('sub_expires', this.user.sub_expires)

      let end = moment(this.user.sub_expires);
      console.log('end', end)
      var now = moment();
      console.log('now', now)
      var d = end.diff(now, 'd'); // 88
      console.log('days', d)
      if (d <= 7) {
        this.canPay = true;
        this.newExpire = moment(this.user.sub_expires).add(366, 'days').toString();
        console.log('newExpire', this.newExpire)
      }
      console.log('canPay', this.canPay);




  }

}
