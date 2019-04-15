import { Component, OnInit, Input} from '@angular/core';
import { ModalController, LoadingController, Events } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthGuard } from '../../../services/auth.guard';
import { timeout } from 'rxjs/operators';
import { BACKEND } from '../../../../environments/environment';
import { delay } from 'rxjs/internal/operators'; // Testing only
import { UtilsService } from '../../../services/utils/utils.service';
import { CacheService } from '../../../services/cache/cache.service';
import { DecimalPipe } from '@angular/common';


@Component({
  selector: 'app-upsert-expense',
  templateUrl: './upsert-expense.page.html',
  styleUrls: ['./upsert-expense.page.scss'],
})


export class UpsertExpensePage implements OnInit {


  wallet:any;
  @Input("expenseParam") expenseParam:any;
  @Input("categoryParam") categoryParam:any;
  @Input("mode") mode:string;

  
  title:string;

  // Data entry fields
  note:string
  categoryOrg:any; // The original category needed if the user changes the cateory_id
  // cat must be initialized or the ngOnInt will cause HTML errors if ngOnInt failes
  category:any = {id:null, name:null, vendors:null};
  amt:number;
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

  //eventHandlerCategories:any; // method to carry "this" into the event handler
  //eventHandlerVendors:any; // method to carry "this" into the event handler

  constructor(private modalController:ModalController, private http:HttpClient,
    private authGuard:AuthGuard, private loadingController:LoadingController,
    private utils:UtilsService, private cache:CacheService, private events:Events,
    private decimalPipe: DecimalPipe) { 

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
          this.vendor = this.expenseParam.vendor;
          if(this.expenseParam.amt < 0){
            this.credit = true;
            this.amt = Math.abs(this.expenseParam.amt); // Make a postive number
          }
          else{
            this.amt = this.expenseParam.amt;
          }
          
          let amt = this.decimalPipe.transform(this.expenseParam.amt, '1.2-2'); // $12,345.0000
          //this.amt = " "+a;
          console.log(amt, typeof amt, this.expenseParam.amt)
          //this.amt = parseFloat(a);
          this.note = this.expenseParam.note;
        }
        //console.log('UpsertExpensePage > ngOnInit', this.mode, this.expenseParam, this.categoryParam, this.categoryOrg);
        this.ready = true;
    }
    catch(err){
      this.showTryAgainBtn = false;
      this.error = err;
    }
  }


  cancel(){
    this.modalController.dismiss(null)
  } 



  showCategories(ev: any) {
    this.hideCatPicker = false;
  }


  hideCategories(ev:any){
    this.hideCatPicker = true;
  }


  showVendors(ev: any) {
    this.hideVendorPicker = false;

  }

  hideVendors(ev:any){
    this.hideVendorPicker = true;
  }


  dateChanged(ev:any){
    this.dateSelected = ev.detail.value;
  }


  async submit(ev:any){
      try{
        console.log('===> SUBMIT', this.mode);
        this.error = null;
        this.showTryAgainBtn = false;

              //console.log('NOTE', this.note)
              //console.log('VENDOR', this.vendor)
              // Leading white space
              if(this.note) this.note.trim(); 
              if(this.vendor) this.vendor.trim(); 
              if(this.vendor && this.vendor.length === 0 )this.vendor = null;
              if(this.note && this.note.length === 0 )this.note = null;
              //console.log('NOTE', this.note)
              //console.log('VENDOR', this.vendor)


              /********** DATA VALIDATION ***********/

              // CATEGORY
              if(!this.category.id){
                  this.error = 'Please select a category.';
                  return;
              }
              //console.log('CATEGORY', this.category.id, this.category.name)
              
              
              // AMT
              //console.log('AMT', this.amt)
              if(!this.amt || this.amt == 0){
                  this.error = 'Invalid amount. Please enter a positive number.';
                  return;
              }
              else if (this.amt < 0){
                  this.error = 'Negative numbers are not allowed. If this is a credit please use the credit toggle and a positive number.';
                  return;
              }
              // Check the percision if there is a decimal point at all
              let x = this.amt.toString();
              let p = this.wallet.currency.percision.split('-')[1];
              console.log('x - p', x, p)
              if(x.indexOf('.') != -1 && x.split(".")[1].length > p){
                if(p == 0)this.error = `No decimals are allowed for this wallet's settings.`;
                else this.error = `Only `+p+` decimals are allowed for this wallet's settings.`;
                return;
              }
              console.log('AMT', this.amt, x, this.wallet.currency.percision, p)

              // DATE
              if(!this.dateSelected){
                this.error = 'Please select a date.';
                return;
              }
              //console.log('DATE', this.dateSelected.split('T')[0], typeof this.dateSelected)
              

          /********** DML **************/

          await this.presentLoading(); // wait for it so it exists, otherwise it may still be null when finally runs
          
          let headers = new HttpHeaders();
          headers = headers.set('Authorization', 'Bearer '+this.authGuard.getUser()['token']);
          headers = headers.set('wallet',  JSON.stringify(this.wallet));

          // Convert amt for credit
          let amt = ((this.credit) ? -Math.abs(this.amt) : this.amt);
          //console.log('converted amount >', amt)

          if(this.mode == 'insert'){
            let body = {vendor:this.vendor, note:this.note, dttm:this.dateSelected, amt:amt}
            var result = await this.http.post(BACKEND.url+'/categories/'+this.category.id+'/expenses', 
              body, {headers: headers} ).pipe(timeout(5000), delay (this.utils.delayTimer)).toPromise();
          }
          else{
            let body = {vendor:this.vendor, note:this.note, dttm:this.dateSelected, amt:amt, cat_id:this.category.id};
            //console.log(body, this.categoryOrg)
            var result = await this.http.put(BACKEND.url+'/categories/'+this.categoryOrg.id+'/expenses/'+this.expenseParam.id, 
              body, {headers: headers} ).pipe(timeout(5000), delay (this.utils.delayTimer)).toPromise();
          }
          let expense = result['expense'];

          // Trim the date
          expense.dttm = expense.dttm.split('T')[0];
          
          // The amt comes back as a string padded to 4 decimal point
          //parseFloat(expense.amt).toFixed(this.percision);

          console.log('UPSERT EXPENSE COMPLETED >>>', expense);

          this.events.publish('dml', {expense:expense, mode:this.mode});
          this.modalController.dismiss({status:"OK"});
      }
      catch(err){
          this.showTryAgainBtn = true;
          this.error = err;
      }
      finally{
          if(typeof this.loading != 'undefined'){
              this.loading.dismiss();
          }
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


  categorySelected(ev:any){
    console.log('categorySelected > ev', ev);
    this.category = {id:ev.id, name:ev.name, vendors:ev.vendors};
    this.hideCatPicker = true;
  }


  vendorSelected(ev:any){
    console.log('vendorSelected > ev', ev);
    this.vendor = ev.name
    //this.vendorInput.nativeElement.value = ev.name;
    this.hideVendorPicker = true;
  }

}
