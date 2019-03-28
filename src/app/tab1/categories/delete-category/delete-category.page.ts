import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { UtilsService } from '../../../services/utils/utils.service';
import { ModalController, AlertController, LoadingController} from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthGuard } from '../../../services/auth.guard';
import { timeout } from 'rxjs/operators';
import { BACKEND } from '../../../../environments/environment';
import { delay } from 'rxjs/internal/operators'; // Testing only


@Component({
  selector: 'app-delete-category.page',
  templateUrl: './delete-category.page.html',
  styleUrls: ['./delete-category.page.scss'],
})
export class DeleteCategoryPage implements OnInit {


  error:any;
  showTryAgainBtn:boolean = false;
  ready:boolean = false;
  loading:any;

  @Input("category") category:any;
  @Input("categories") categories:any;
  categoriesList = [];
  wallet:any;
  
  transactionCnt:number;
  radioSelection:string;
  moveTo:string = '0';



  constructor(private utilsService:UtilsService, private modalController:ModalController,
    private http:HttpClient, private authGuard:AuthGuard, private alertController:AlertController,
    private loadingController:LoadingController) { }


  ngOnInit() {
      try{
        this.wallet = JSON.parse(localStorage.getItem('wallet'));
        this.getCategory();

        // Create deep coy without the category to be deleted
        for(let i=0; i<this.categories.length; i++){
           if(this.categories[i].id != this.category.id){
            this.categoriesList.push(this.categories[i]);
           }
        }
      }
      catch(err){
        this.error = this.utilsService.getErrorMessage(err);
      }
  }


  cancel(){
      this.modalController.dismiss(null)
  } 


  radioChanged(ev:any){
    this.error = null;
  }


  async getCategory(){
    try{
      this.ready = false;
      this.error = null;
      this.error = null;
      this.showTryAgainBtn = false;

      let headers = new HttpHeaders();

      await this.presentLoading('Getting category info, please wait...'); // wait for it so it exists, otherwise it may still be null when finally runs
      headers = headers.set('Authorization', 'Bearer '+this.authGuard.getUser()['token']);
      headers = headers.set('wallet',  JSON.stringify(this.wallet));
  
      var result = await this.http.get(BACKEND.url+'/categories/'+this.category.id, {headers: headers} )
        .pipe(timeout(5000), delay(this.utilsService.delayTimer)).toPromise();
      this.category = result['category'];
      this.transactionCnt = result['transactionCnt'];
      this.ready = true;
    }
    catch(err){
      this.error = this.utilsService.getErrorMessage(err);
      this.showTryAgainBtn = true;
    }
    finally{
      this.loading.dismiss();
      
    }
    
  }


  async apply(transferID) {
    try{
        this.error = null;
        this.showTryAgainBtn = false;

        await this.presentLoading('Deleting, please wait...'); // wait for it so it exists, otherwise it may still be null when finally runs
        //console.log(this.authGuard.getUser(), this.wallet);

        this.error = null;
        let headers = new HttpHeaders();
        headers = headers.set('Authorization', 'Bearer '+this.authGuard.getUser()['token']);
        headers = headers.set('wallet',  JSON.stringify(this.wallet));

        //console.log(BACKEND.url+'/categories/'+this.category.id+transferID, {headers: headers} )
        var result = await this.http.delete(BACKEND.url+'/categories/'+this.category.id+transferID, {headers: headers} ).pipe(timeout(5000)).toPromise();
        this.modalController.dismiss({status:"OK"});
    }
    catch(err){
        this.error = this.utilsService.getErrorMessage(err);
        this.showTryAgainBtn = true;
    }
    finally{
        this.loading.dismiss();
    }
  };


  tryAgain(ev){
    if (!this.ready) this.getCategory();
    else this.presentAlertConfirm();
  }


  moveToCategory(id){
      this.moveTo = id;
      //console.log('move to', this.moveTo)
  }


  
  async presentAlertConfirm() {

    let transferID = "";
      if(this.radioSelection == "move" && this.transactionCnt > 0){
          if(this.moveTo == "0") {
            this.error = this.utilsService.getErrorMessage(`Please select an category to move expenses to. See "Move to Category" below.`);
            return;
          }
          else 
            transferID = "/"+this.moveTo;
      }


    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: 'Are you sure?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            
          }
        }, {
          text: 'Continue',
          handler: () => {

            this.apply(transferID);
          }
        }
      ]
    });

    await alert.present();
  }


  async presentLoading(message) {
    this.loading = await this.loadingController.create({
      message: message,
      keyboardClose:true,
      showBackdrop:true
    });
    await this.loading.present();
    // const { role, data } = await this.load.onDidDismiss();
    // console.log('Loading dismissed!');
  }

}
