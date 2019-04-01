import { Component, OnInit, Input, ElementRef, ViewChild} from '@angular/core';
import { ModalController, PopoverController, Events } from '@ionic/angular';
import { CategoriesPopoverComponent } from '../../../components/categories/categories-popover/categories.popover.component';


@Component({
  selector: 'app-upsert-expense',
  templateUrl: './upsert-expense.page.html',
  styleUrls: ['./upsert-expense.page.scss'],
})


export class UpsertExpensePage implements OnInit {


  @Input("expenseParam") expenseParam:any;
  @Input("categoryParam") categoryParam:any;
  @Input("mode") mode:string;
  @ViewChild('catPopoverBtn') catPopoverBtn: ElementRef;
  title:string;
  catPopover:any;

  @ViewChild('vendorInput') vendorInput: ElementRef;
  @ViewChild('amtInput') amtInput: ElementRef;
  //@ViewChild('dateInput') dateInput: ElementRef;
  //@ViewChild('noteInput') noteInput: ElementRef;
  note:string
  //vendor:string;
  category = {id:null, name:null, vendor:null, amt:null};
  amt:number;


  dateDefault:string;
  dateSelected:string;

  eventHandler:any; // method to carry "this" into the event handler


  constructor(private modalController:ModalController, private popoverCtrl:PopoverController,
    private events:Events, private element:ElementRef) { 

  }



  ngOnInit() {
    console.log('UpsertExpensePage > ngOnInit', this.mode, this.expenseParam, this.categoryParam)
    //this.showCategories({srcElement:this.catPopoverBtn.el});

    // Open the cat list for insert
    if(this.mode === 'insert'){
      this.title = 'New Expense';
      let element: HTMLElement = document.getElementById('catPopoverBtn') as HTMLElement;
      console.log('btn', element)
      element.click();
    }
    else{
      console.log(this.expenseParam);
      this.title = "Edit Expense";
      this.category = JSON.parse(JSON.stringify(this.categoryParam)); // Deep copy because the param is read only

      // Date
      // Set to noon of the date so all time zones can adjust of of noon to stay on the same day
      this.dateDefault = new Date(this.expenseParam.dttm+'T12:00:00').toISOString();
      this.dateSelected = this.dateDefault;
      console.log('toISOString()', this.dateDefault);





      this.vendorInput.nativeElement.value = this.expenseParam.vendor;
      //this.vendor = this.expenseParam.vendor;
      this.amtInput.nativeElement.value = this.expenseParam.amt;
      //this.dateInput.nativeElement.value = this.expenseParam.dttm;
      this.note = this.expenseParam.note;
    }

    this.eventHandler = this.loadEvent.bind( this );
    this.events.subscribe('category-picked', this.eventHandler);
  }


  ngOnDestroy(){
    console.log('>>>>>>>>>>>>>>>> UpsertExpensePage.ngOnDestroy <<<<<<<<<<<<<<<<<')
    this.events.unsubscribe('category-picked', this.eventHandler);
  }


  loadEvent(data:any){
    try{
      console.log('UpsertExpensePage > loadEvent > subscribe > fired > category-picked')
      console.log(this)
      console.log(data)
      this.category.id = data.id;
      this.category.name = data.name;
      this.catPopover.dismiss();

    }
    catch(err){
      console.log('loadEvent', err)
      //this.error = err;
    }
  }


  apply(ev:any){
    ;
  }


  cancel(){
    this.modalController.dismiss(null)
  } 


  async showCategories(ev: any) {
    console.log(2, ev)
    this.catPopover = await this.popoverCtrl.create({
        component: CategoriesPopoverComponent,
        animated: true,
        keyboardClose:true
    });
    return await this.catPopover.present();
  }



  dateChanged(ev:any){
    console.log(ev);
    this.dateSelected = ev.detail.value;
  }

  submit(ev:any){
    console.log('===> SUBMIT', ev);
    this.note = this.element.nativeElement.getElementsByTagName('textarea')[0].value;
    console.log('NOTE', this.note)
    console.log('VENDOR', this.vendorInput.nativeElement.value)

    // CATEGORY
    if(!this.category.id){
      console.log('NO CATEGORY SELECTED');
      return;
    }
    console.log('CATEGORY', this.category.id, this.category.name)
    
    // AMOUNT
    let amt = this.amtInput.nativeElement.value;
    console.log('AMT', amt)
    if(!amt || amt == 'undefined' || amt == 0){
      console.log('INVALID AMOUNT');
      return;
    }
    if(isNaN(amt)){
      console.log('INVALID AMOUNT (isNan)');
      return;
    }

    // DATE
    console.log('DATE', this.dateSelected.split('T')[0], typeof this.dateSelected)
    //console.log('DATE', this.dateInput.nativeElement.value)

    
    //this.category.vendor = this.vendorInput.nativeElement.value;
    //this.expense.amt = this.amtInput.nativeElement.value;
    //console.log("category", this.category);
    //console.log("expense", this.expense);

  }

}
