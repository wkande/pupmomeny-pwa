import { Component, OnInit, HostListener } from '@angular/core';
import { Platform } from '@ionic/angular';
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
  card:any = {number:'', expires:'', cv:''};

  showTryAgainBtn:boolean = false;
  error:any;

  platformInputType:string = 'text';
  
  constructor(public platform:Platform) { }


  ngOnInit() {

      if(this.platform.is('ios')) { this.platformInputType = 'number'; }

      this.user = JSON.parse(localStorage.getItem('user'));
      //console.log('sub_expires', this.user.sub_expires)

      let end = moment(this.user.sub_expires);
      //console.log('end', end)
      var now = moment();
      //console.log('now', now)
      var d = end.diff(now, 'd'); // 88
      //console.log('days', d)
      if (d <= 7) {
        this.canPay = true;
        this.newExpire = moment(this.user.sub_expires).add(366, 'days').toString();
        //console.log('newExpire', this.newExpire)
      }
      //console.log('canPay', this.canPay);
  }


  chars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "/"];
  //@HostListener('window:keyup', ['$event'])
  /**
   * Fires the KeyPadPress method from the desktop keybaord
   * @TODO :ool into international keyboard characters
   */
  expiresKeyEvent_xxxxxxxxxx(event: KeyboardEvent) {
    let willBe = this.card.expires+event.key;
    console.log('willBe', willBe)
    if (!this.chars.includes(event.key))
      return false;
    if(willBe.length > 5){
      console.log('LEN', willBe.length)
      return false;
    }
    console.log('expiresKeyEvent', event.key, this.chars.includes(event.key));
    console.log('this.card.expires', this.card.expires)
    

  }

  //cardChars = [];
  /**
   * Fires the KeyPadPress method from the desktop keybaord
   * @TODO :ool into international keyboard characters
   */
  cardKeyEvent_xxxxxxxxx(event: KeyboardEvent) {
    if (!this.chars.includes(event.key))
      return false;
    console.log('expiresKeyEvent', event.key, this.chars.includes(event.key));

  }



  numbChars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", " "];
  validateNumber(){
      if(this.card.number.length === 0) return false;
      //console.log('validateNumber')
      let arr = this.card.number.split("");
      //console.log('= array', arr)
      for(let i=0; i<arr.length; i++){
        if (!this.numbChars.includes(arr[i]))
            return false;
      }
      return true;
  }


  expiresChars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "/"];
  expiresMonths = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
  validateExpires(){
      //console.log(this.card.expires.length);
      let arr = this.card.expires.split("/");
      //console.log(arr, arr.length)
      // Must be exactly 2 rows in hte array
      if( arr.length != 2 ) {console.log('here'); return false;}
      // Only 5 char allowed
      else if ( this.card.expires.length > 5 ) {console.log('here 2'); return false;}
      // Check the month
      else if( !this.expiresMonths.includes(arr[0]) ) {console.log('here 3'); return false}
      // Check the year
      else if( parseInt(arr[1]) < 19  || parseInt(arr[1]) > 99 ) {console.log('here 4'); return false}

      // Check for vailid characters
      arr = this.card.expires.split("");
      //console.log('> array', arr)
      for(let i=0; i<arr.length; i++){
        if (!this.expiresChars.includes(arr[i]))
            return false;
      }
      return true;
}


cvChars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  validateCv(){
      if(this.card.cv.length === 0) return false;
      //console.log('validateNumber')
      let arr = this.card.number.split("");
      //console.log('= array', arr)
      for(let i=0; i<arr.length; i++){
        if (!this.cvChars.includes(arr[i]))
            return false;
      }
      return true;
  }


  payNow(ev:any){
      console.log('===> PAY NOW');
      this.error = null;
      this.showTryAgainBtn = false;


      if(!this.validateNumber()){
        this.error = "The credit card number is not valid. Only numbers and spaces are allowed.";
        console.log(this.error);
        return;
      }
      else if(!this.validateExpires()){
        this.error = "The expires date is not valid (mm/yy). Only numbers and one slash (/) are allowed. Check the year and month as well.";
        console.log(this.error);
        return;
      }
      else if(!this.validateCv()){
        this.error = "The CV number is not valid. Only numbers are allowed. It is usually on the back of the card.";
        console.log(this.error);
        return;
      }




      this.showTryAgainBtn = true;
      console.log('payNow OK', this.card.expires)
  }
}
