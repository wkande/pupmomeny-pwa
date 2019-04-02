import { Component, OnInit, Input } from '@angular/core';
import { Events } from '@ionic/angular'


@Component({
  selector: 'vendors-popover',
  templateUrl: './vendors.popover.component.html',
  styleUrls: ['./vendors.popover.component.scss'],
})


/** This component is a vendor picker that gets displayed on the upsert-expenses modal.
  * Rather that using an Output EventEmitter is uses a standard Event.
  */


export class VendorsPopoverComponent implements OnInit {


  @Input() category:any; // The category object with a vendors key
  manage:boolean = false;

  constructor(private events:Events) { 
    console.log('>>>>>>>>>>>>>>>> VendorsPopoverComponent.constructor <<<<<<<<<<<<<<<<<')
  }


  ngOnInit() {
    console.log('>>>>>>>>>>>>>>>> VendorsPopoverComponent.ngOnInit <<<<<<<<<<<<<<<<<')
    console.log('VendorsPopoverComponent > ngOnInt > this.categories > ', this.category);
  }


  selected(ev:any, name:string){
    console.log('Vendor selected', name)
    this.events.publish('vendor-picked', {name:name});
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
    this.category.vendors.push("");
    console.log(this.category.vendors)
  }

}
