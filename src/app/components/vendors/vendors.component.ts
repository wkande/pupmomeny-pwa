import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { AlertController } from '@ionic/angular';

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


  constructor(private alert:AlertController) { 
    console.log('>>>>>>>>>>>>>>>> VendorsComponent.constructor <<<<<<<<<<<<<<<<<')
  }


  ngOnInit() {
    console.log('>>>>>>>>>>>>>>>> VendorsComponent.ngOnInit <<<<<<<<<<<<<<<<<')
    console.log('VendorsComponent > ngOnInt > this.category > ', this.category);
    //if(this.category.id)
      //this.vendorsManage = Array.from(this.category.vendors); // Deep copy
  }


  ngOnChanges(changes: SimpleChanges) {
    console.log('>>>>>>>>>>>>>> VendorsComponent ngOnChange fired.', changes);
    if(changes.category.currentValue && changes.category.currentValue.id){
      console.log('ngOnChanges', changes.category.currentValue);
      this.vendorsManage = changes.category['vendors'];
    }
  }


  vendorSelected(ev:any, name:string){
    console.log('Vendor selected', name);
    this.selected.emit({name:name});
  }


  manageVendors(ev:any){
    this.vendorsManage = JSON.parse(JSON.stringify(this.category.vendors))
    this.manage = true; //this.manage != true;
  }


  manageVendorsCancel(ev:any){
    this.manage = false;
  }


  manageVendorRemove(ev:any, i:number){
    this.vendorsManage.splice(i, 1);
  }

  manageVendorsSave(ev:any){
    console.log('SAVE', this.vendorsManage)
    this.category.vendors = this.vendorsManage;
    this.manage = false;
  }


  async presentAlertPrompt() {
    const alert = await this.alert.create({
      header: 'Prompt!',
      inputs: [
        {
          name: 'vendor',
          type: 'text',
          placeholder: 'Enter vendor name'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            console.log(data)
            this.vendorsManage.unshift(data.vendor);
            console.log('Confirm Ok');
          }
        }
      ]
    });

    await alert.present();
    console.log('AFTER AWAIT', alert.inputs)
  }

}
