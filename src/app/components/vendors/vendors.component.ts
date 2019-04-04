import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';


@Component({
  selector: 'vendors-component',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.scss'],
})


/** This component is a vendor picker that gets displayed on the upsert-expenses modal.
  * The component can be set into manage mode by tripping the manage @Input
  *
  * Usage:
    <vendors-component
      [manage]=flag
      [category]="category"
      (selected)="vendorSelected($event)">
    </vendors-component>
  */


export class VendorsComponent implements OnInit {


  @Input() category:any; // The category object with a vendors array
  vendorsManage:any; // deep copy
  @Input() manage:boolean = false;
  @Output() selected: EventEmitter<any> = new EventEmitter<any>();

  constructor() { 
    console.log('>>>>>>>>>>>>>>>> VendorsComponent.constructor <<<<<<<<<<<<<<<<<')
  }


  ngOnInit() {
    console.log('>>>>>>>>>>>>>>>> VendorsComponent.ngOnInit <<<<<<<<<<<<<<<<<')
    console.log('VendorsComponent > ngOnInt > this.categories > ', this.category);
    if(this.category.id)
      this.vendorsManage = Array.from(this.category.vendors); // Deep copy
  }


  ngOnChanges(changes: SimpleChanges) {
    console.log('>>>>>>>>>>>>>> VendorsComponent ngOnChange fired.', changes);
    if(changes.category.currentValue.id){
      console.log('ngOnChanges', changes.category.currentValue);
      //console.log('this.error', this.error)
      //this.getErrorMessage(this.error);
      this.vendorsManage = changes.category['vendors'];
    }

  }


  vendorSelected(ev:any, name:string){
    console.log('Vendor selected', name);
    this.selected.emit({name:name});
  }


  manageVendors(ev:any){
    this.manage = true;
  }


  manageVendorsCancel(ev:any){
    this.manage = false;
  }


  manageVendorsSave(ev:any){
    this.manage = false;
  }


  manageVendorsAddLine(ev:any){
    this.vendorsManage.unshift("New");
    console.log(this.category.vendors)
    let inputs = document.getElementsByTagName('ion-input');
    for (let i = 0; i < inputs.length; ++i) {
        console.log(i, inputs[i].value);
    }
  }

}
