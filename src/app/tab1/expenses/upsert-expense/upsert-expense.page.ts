import { Component, OnInit, Input, ElementRef, ViewChild} from '@angular/core';
import { ModalController, PopoverController, Events, LoadingController } from '@ionic/angular';
import { CategoriesPopoverComponent } from '../../../components/categories/categories-popover/categories.popover.component';
import { VendorsPopoverComponent } from '../../../components/categories/vendors-popover/vendors.popover.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthGuard } from '../../../services/auth.guard';
import { timeout } from 'rxjs/operators';
import { BACKEND } from '../../../../environments/environment';
import { delay } from 'rxjs/internal/operators'; // Testing only
import { UtilsService } from '../../../services/utils/utils.service';

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
  @ViewChild('catPopoverBtn') catPopoverBtn: ElementRef;
  categoryOrg:any; //The original cat need if the user changes the cat
  title:string;

  catPopover:any;
  vendorPopover:any;

  @ViewChild('vendorInput') vendorInput: ElementRef;
  @ViewChild('amtInput') amtInput: ElementRef;
  note:string
  category = {id:null, name:null, vendors:null};
  amt:number;


  dateDefault:string;
  dateSelected:string;

  error:any;
  showTryAgainBtn:boolean = false;
  ready:boolean = false;
  loading:any;

  eventHandlerCategories:any; // method to carry "this" into the event handler
  eventHandlerVendors:any; // method to carry "this" into the event handler

  constructor(private modalController:ModalController, private popoverCtrl:PopoverController,
    private events:Events, private element:ElementRef, private http:HttpClient,
    private authGuard:AuthGuard, private loadingController:LoadingController,
    private utils:UtilsService) { 

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
          this.categoryOrg = JSON.parse(JSON.stringify(this.categoryParam));
          this.title = "Edit Expense";
          this.category = JSON.parse(JSON.stringify(this.categoryParam)); // Deep copy because the param is read only

          // Date
          // Set to noon of the date so all time zones can adjust of of noon to stay on the same day
          this.dateDefault = new Date(this.expenseParam.dttm+'T12:00:00').toISOString();
          this.dateSelected = this.dateDefault;

          // Vendor, amt, note
          this.vendorInput.nativeElement.value = this.expenseParam.vendor;
          this.amtInput.nativeElement.value = this.expenseParam.amt;
          this.note = this.expenseParam.note;
        }

        console.log('UpsertExpensePage > ngOnInit', this.mode, this.expenseParam, this.categoryParam, this.categoryOrg);

        this.eventHandlerCategories = this.loadEventCategories.bind( this );
        this.events.subscribe('category-picked', this.eventHandlerCategories);

        this.eventHandlerVendors = this.loadEventVendors.bind( this );
        this.events.subscribe('vendor-picked', this.eventHandlerVendors);
        this.ready = true;
    }
    catch(err){
      this.showTryAgainBtn = false;
      this.error = err;
    }
  }


  ngOnDestroy(){
    console.log('>>>>>>>>>>>>>>>> UpsertExpensePage.ngOnDestroy <<<<<<<<<<<<<<<<<')
    this.events.unsubscribe('category-picked', this.eventHandlerCategories);
    this.events.unsubscribe('vendor-picked', this.eventHandlerVendors);
  }


  loadEventCategories(data:any){
    try{
      console.log('UpsertExpensePage > loadEventCategories > subscribe > fired > category-picked')
      console.log(data)
      this.category.id = data.id;
      this.category.name = data.name;
      this.category.vendors = data.vendors;
      this.catPopover.dismiss();
    }
    catch(err){
      this.error = err;
    }
  }


  loadEventVendors(data:any){
    try{
      console.log('UpsertExpensePage > loadEventVendors > subscribe > fired > vendor-picked')
      console.log(data)
      this.vendorInput.nativeElement.value = data.name;
      this.vendorPopover.dismiss();
    }
    catch(err){
      this.error = err;
    }
  }


  cancel(){
    this.modalController.dismiss(null)
  } 


  /**
   * Popover list of categories
   * @param ev 
   */
  async showCategories(ev: any) {
    console.log(2, ev)
    this.catPopover = await this.popoverCtrl.create({
        component: CategoriesPopoverComponent,
        animated: true,
        keyboardClose:true
    });
    return await this.catPopover.present();
  }


  /**
   * Popover list of vendors
   * @param ev 
   */
  async showVendors(ev: any) {
    console.log(2, ev)
    this.vendorPopover = await this.popoverCtrl.create({
        component: VendorsPopoverComponent,
        componentProps: { category:this.category },
        animated: true,
        keyboardClose:true
    });
    return await this.vendorPopover.present();
  }


  dateChanged(ev:any){
    this.dateSelected = ev.detail.value;
  }


  async submit(ev:any){
      try{
        console.log('===> SUBMIT', ev, this.mode);
        this.error = null;
        this.showTryAgainBtn = false;

              this.note = this.element.nativeElement.getElementsByTagName('textarea')[0].value;
              let vendor = this.vendorInput.nativeElement.value;
              console.log('NOTE', this.note)
              console.log('VENDOR', vendor)

              // CATEGORY
              if(!this.category.id){
                this.error = 'NO CATEGORY SELECTED';
                return;
              }
              console.log('CATEGORY', this.category.id, this.category.name)
              
              // AMOUNT
              let amt = this.amtInput.nativeElement.value;
              console.log('AMT', amt)
              if(!amt || amt == 'undefined' || amt == 0){
                this.error = 'INVALID AMOUNT';
                return;
              }
              if(isNaN(amt)){
                this.error = 'INVALID AMOUNT (isNan)';
                return;
              }

              // DATE
              if(!this.dateSelected){
                this.error = 'INVALID DATE';
                return;

              }
              console.log('DATE', this.dateSelected.split('T')[0], typeof this.dateSelected)
   
        // Do DML
        await this.presentLoading(); // wait for it so it exists, otherwise it may still be null when finally runs
        
        let headers = new HttpHeaders();
        headers = headers.set('Authorization', 'Bearer '+this.authGuard.getUser()['token']);
        headers = headers.set('wallet',  JSON.stringify(this.wallet));

        if(this.mode == 'insert'){
          let body = {vendor:vendor, note:this.note, dttm:this.dateSelected, amt:amt}
          var result = await this.http.post(BACKEND.url+'/categories/'+this.category.id+'/expenses', 
            body, {headers: headers} ).pipe(timeout(5000), delay (this.utils.delayTimer)).toPromise();
        }
        else{
          let body = {vendor:vendor, note:this.note, dttm:this.dateSelected, amt:amt, cat_id:this.category.id};
          console.log(body, this.categoryOrg)
          var result = await this.http.put(BACKEND.url+'/categories/'+this.categoryOrg.id+'/expenses/'+this.expenseParam.id, 
            body, {headers: headers} ).pipe(timeout(5000), delay (this.utils.delayTimer)).toPromise();
        }
        this.category = result['expense'];
        this.modalController.dismiss({category:this.category, mode:this.mode});
      }
      catch(err){
        this.showTryAgainBtn = true;
        this.error = err;
      }
      finally{
        this.loading.dismiss();
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

}
