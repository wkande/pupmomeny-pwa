import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { LoadingController} from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthGuard } from '../../services/auth.guard';
import { timeout } from 'rxjs/operators';
import { BACKEND } from '../../../environments/environment';
import { delay } from 'rxjs/internal/operators'; // Testing only
import { UtilsService } from '../../services/utils/utils.service';


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


  //@ViewChild('manageList') manageList:any; 
  @Input() category:any; // The category object with a vendors array
  vendorsManage:any; // deep copy
  @Input() manage:boolean = false;
  @Output() selected: EventEmitter<any> = new EventEmitter<any>();

  wallet:any;
  error:any;
  showTryAgainBtn:boolean = false;
  loading:any;


  constructor(private http:HttpClient, private authGuard:AuthGuard, private loadingController:LoadingController,
    private utils:UtilsService) { 
    console.log('>>>>>>>>>>>>>>>> VendorsComponent.constructor <<<<<<<<<<<<<<<<<')
  }


  ngOnInit() {
    console.log('>>>>>>>>>>>>>>>> VendorsComponent.ngOnInit <<<<<<<<<<<<<<<<<')
    console.log('VendorsComponent > ngOnInt > this.category > ', this.category);
    this.wallet = JSON.parse(localStorage.getItem('wallet'));
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


  setManageVendors(ev:any){
    this.vendorsManage = JSON.parse(JSON.stringify(this.category.vendors))
    this.manage = true; //this.manage != true;
  }


  /**
   * For the mangeVendor list. Not sure this is really needed but it does not hurt.
   * @param index 
   * @param item 
   */
  trackByID(index:number, item){
    return item.id; 
  }


  manageVendorsCancel(ev:any){
    this.manage = false;
  }


  manageVendorsAdd(ev:any){
    this.vendorsManage.unshift("");
  }


  manageVendorRemove(ev:any, i:number){
    this.vendorsManage.splice(i, 1);
  }


  async manageVendorsSave(ev:any) {
    try{
        
        var inputs:any = document.querySelectorAll('#manageForm input');
        this.category.vendors = [];
        for(let i=0;i<inputs.length; i++){
          // Remove double quotes from vendor name

          inputs[i].value = inputs[i].value.trim();
          inputs[i].value = inputs[i].value.replace(/"/g, '');
          // Add to category.vendor
          if(inputs[i].value && inputs[i].value.length > 0)
            this.category.vendors.push(inputs[i].value);
        }
        console.log(inputs, this.category, this.vendorsManage)

        this.error = null;
        this.showTryAgainBtn = false;
        await this.presentLoading(); // wait for it so it exists, otherwise it may still be null when finally runs
        
        let headers = new HttpHeaders();
        headers = headers.set('Authorization', 'Bearer '+this.authGuard.getUser()['token']);
        headers = headers.set('wallet',  JSON.stringify(this.wallet));

        var result = await this.http.patch(BACKEND.url+'/categories/'+this.category.id+'/vendors', 
          {vendors:this.category.vendors}, {headers: headers} ).pipe(timeout(5000), delay (this.utils.delayTimer)).toPromise();

        this.manage = false;
    }
    catch(err){
      this.showTryAgainBtn = true;
      this.error = err;
    }
    finally{
      this.loading.dismiss();
    }
};



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
