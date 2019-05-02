import { Component, OnInit, Input, ElementRef, ViewChild} from '@angular/core';
import { IonContent } from '@ionic/angular';
import { ModalController, LoadingController, Events } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthGuard } from '../../../services/auth.guard';
import { timeout } from 'rxjs/operators';
import { BACKEND } from '../../../../environments/environment';
import { delay } from 'rxjs/internal/operators'; // Testing only
import { UtilsService } from '../../../services/utils/utils.service';
import { CacheService } from '../../../services/cache/cache.service';
import * as currency from 'currency.js';
import { async } from 'q';

@Component({
  selector: 'app-upsert-expense',
  templateUrl: './upsert-expense.page.html',
  styleUrls: ['./upsert-expense.page.scss'],
})


export class UpsertExpensePage implements OnInit {


  @ViewChild(IonContent) content: IonContent;
  wallet:any;
  @Input("expenseParam") expenseParam:any;
  @Input("categoryParam") categoryParam:any;
  @Input("mode") mode:string;
  @ViewChild('datePicker') datePicker:ElementRef;

  @ViewChild('inputAmt') inputAmt:ElementRef;

  
  title:string;

  // Data entry fields
  note:string
  categoryOrg:any; // The original category needed if the user changes the cateory_id
  // cat must be initialized or the ngOnInt will cause HTML errors if ngOnInt failes
  category:any = {id:null, name:null, vendors:null};
  amt:string;
  credit:boolean = false;
  vendor:string;
  dateDefault:string;
  dateSelected:string;

  error:any;
  showTryAgainBtn:boolean = false;
  ready:boolean = false;
  loading:any;


  // Component hide flags
  hideCatPicker:boolean = true;
  hideVendorPicker:boolean = true;
  hideKeypad:boolean = true;

  //eventHandlerCategories:any; // method to carry "this" into the event handler
  //eventHandlerVendors:any; // method to carry "this" into the event handler

  constructor(private modalController:ModalController, private http:HttpClient,
    private authGuard:AuthGuard, private loadingController:LoadingController,
    private utils:UtilsService, private cache:CacheService, private events:Events) { 

  }


  ngOnInit() {
    try{
        this.wallet = JSON.parse(localStorage.getItem('wallet'));
        // Insert
        if(this.mode === 'insert'){
          this.title = 'New Expense';
          let element: HTMLElement = document.getElementById('catPopoverBtn') as HTMLElement;
          element.click(); // Open the category popover list
        }
        // Edit
        else{
          console.log('>>>>>>> START WITH this.expenseParam.amt', this.expenseParam.amt)
          this.categoryOrg = JSON.parse(JSON.stringify(this.categoryParam)); // Deep copy because the param is read only
          // The vendors in catgeory may-or-may-not be presented, get them from cache
          this.categoryOrg.vendors = this.cache.getVendors(this.categoryOrg.id);
          this.category = JSON.parse(JSON.stringify(this.categoryOrg)); // Deep copy

          this.title = "Edit Expense";

          // Date
          // Set to noon of the date so all time zones can adjust of of noon to stay on the same day
          this.dateDefault = new Date(this.expenseParam.dttm+'T12:00:00').toISOString();
          this.dateSelected = this.dateDefault;

          // Vendor, amt, note
          /////////////////////////
          this.vendor = this.expenseParam.vendor;
          if(this.expenseParam.amt < 0){
            this.credit = true;
            // Make a postive number
            this.amt = Math.abs(this.expenseParam.amt).toString();
          }
          else{
            this.amt = this.expenseParam.amt;
          }
          
          //@ts-ignore
          this.amt = currency(this.amt, this.wallet['currency']).format(true);
          console.log('3 this.amt', this.amt, typeof this.amt)

          this.note = this.expenseParam.note;
        }

        this.ready = true;
    }
    catch(err){
      this.showTryAgainBtn = false;
      this.error = err;
    }
  }


  cancel(){
    this.modalController.dismiss(null);
  } 

  toggleKeypad(en:any){
    this.hideKeypad = !this.hideKeypad;
  }

  keyPadPress(key:string){
    console.log(key)
    if(key === 'b')
        this.amt = this.amt.substring(0, this.amt.length-1);
    else
      this.amt += key;
    this.beep();
  }

  // https://github.com/flukeout/simple-sounds
  beep() {
  }


  showCategories(ev: any) {
    this.hideKeypad = true;
    this.hideCatPicker = false;
  }


  hideCategories(ev:any){
    this.hideKeypad = true;
    this.hideCatPicker = true;
  }


  showVendors(ev: any) {
    this.hideKeypad = true;
    this.hideVendorPicker = false;
  }

  hideVendors(ev:any){
    this.hideKeypad = true;
    this.hideVendorPicker = true;
  }

  showDatePicker() {
    this.hideKeypad = true;
    //@ts-ignore
    this.datePicker.open();
  }

  ____________________scroll(ev:any){

    this.note += ' hey';
    setTimeout(() => {
      this.content.scrollToBottom();
    });
    
  }


  dateChanged(ev:any){
    this.error = null;
    this.dateSelected = ev.detail.value;
  }

  chars = [];
  onKeyPress(ev:any){
    // Set up cahr array for the key check if it does not exist
    if(this.chars.length === 0)
        this.chars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", this.wallet.currency.decimal];
    // If this.amt already contains the decimal symbol return false;
    if( ev.key === this.wallet.currency.decimal && this.amt.toString().indexOf(this.wallet.currency.decimal) > 0 )  
        return false;

    console.log(ev.key, this.amt)
    console.log(this.chars.includes(ev.key))
    return this.chars.includes(ev.key);
  }


  /**
   * Submit the form.
   * @param ev 
   */
  async submit(ev:any){

      try{
        console.log('===> SUBMIT', this.mode);
        this.error = null;
        this.showTryAgainBtn = false;

        /********** VALIDATE **************/

              // Leading white space
              if(this.note) this.note.trim(); 
              if(this.vendor) this.vendor.trim(); 
              if(this.vendor && this.vendor.length === 0 )this.vendor = null;
              if(this.note && this.note.length === 0 )this.note = null;

              // CATEGORY
              if(!this.category.id){
                  this.error = 'Please select a category.';
                  return;
              }
              
              // AMT
              
              if(!this.amt || this.amt == 0){
                this.error = 'Invalid amount. Please enter a positive number.';
                return;
              }
              else if(isNaN( parseFloat(this.amt.toString())) ){
                this.error = "Amount is not a valid number.";
                return;
              }
              
              else if (this.amt < 0){ // This should never fire but ya never know
                  this.error = 'Negative numbers are not allowed. If this is a credit please use the credit toggle and a positive number.';
                  return;
              }
              
              else if(this.amt.toString().indexOf('.') > -1){
                  if(this.amt.toString().split('.')[1].length > this.wallet.currency.precision){
                    this.error = "Your preferences only allow "+this.wallet.currency.precision+" decimals points.";
                    return;
                  }
              }

              // If using a comma as the decimal then switch it to a period
              // Use this WITH NON
              let amount = this.amt.toString().replace(/,/g, '.');
              console.log(this.amt, amount, parseFloat(this.amt.toString()))
              

              // DATE
              if(!this.dateSelected){
                this.error = 'Please select a date.';
                return;
              }

          /********** DML **************/
          await this.presentLoading(); // wait for it so it exists, otherwise it may still be null when finally runs
          
          let headers = new HttpHeaders();
          headers = headers.set('Authorization', 'Bearer '+this.authGuard.getUser()['token']);
          headers = headers.set('wallet',  JSON.stringify(this.wallet));

          // Convert amt for credit
          let amt = ((this.credit) ? -Math.abs(this.amt) : this.amt);

          if(this.mode == 'insert'){
            let body = {vendor:this.vendor, note:this.note, dttm:this.dateSelected, amt:amt}
            var result = await this.http.post(BACKEND.url+'/categories/'+this.category.id+'/expenses', 
              body, {headers: headers} ).pipe(timeout(5000), delay (this.utils.delayTimer)).toPromise();
          }
          else{
            let body = {vendor:this.vendor, note:this.note, dttm:this.dateSelected, amt:amt, cat_id:this.category.id};
            var result = await this.http.put(BACKEND.url+'/categories/'+this.categoryOrg.id+'/expenses/'+this.expenseParam.id, 
              body, {headers: headers} ).pipe(timeout(5000), delay (this.utils.delayTimer)).toPromise();
          }
          let expense = result['expense'];

          // Trim the date
          expense.dttm = expense.dttm.split('T')[0];
          
          console.log('UPSERT >>>', expense);

          this.events.publish('redraw', {expense:expense, mode:this.mode});
          this.modalController.dismiss({status:"OK"});
      }
      catch(err){
          this.showTryAgainBtn = true;
          this.error = err;
      }
      finally{
        if(this.loading) this.loading.dismiss();
      }
  }


  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Submitting changes, please wait...',
      keyboardClose:true,
      showBackdrop:true
    });
    await this.loading.present();
    //const { role, data } = await this.load.onDidDismiss();
    //console.log('Loading dismissed!');
  }


  componentError(ev:any){
    this.error = ev.toString();
  }


  categorySelected(ev:any){
    this.error = null;
    console.log('categorySelected > ev', ev);
    this.category = {id:ev.id, name:ev.name, vendors:ev.vendors};
    this.hideCatPicker = true;
  }


  vendorSelected(ev:any){
    this.error = null;
    console.log('vendorSelected > ev', ev);
    this.vendor = ev.name
    //this.vendorInput.nativeElement.value = ev.name;
    this.hideVendorPicker = true;
  }

}
