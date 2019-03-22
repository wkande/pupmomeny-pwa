import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ModalController, LoadingController} from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthGuard } from '../../services/auth.guard';
import { timeout } from 'rxjs/operators';
import { BACKEND } from '../../../environments/environment';


@Component({
  selector: 'app-upsert-category',
  templateUrl: './upsert-category.page.html',
  styleUrls: ['./upsert-category.page.scss'],
})


export class UpsertCategoryPage implements OnInit {

  @ViewChild('nameInput') nameInput: ElementRef;
  @Input("category") category:any;
  @Input("mode") mode:string;
  title:string;
  wallet:any;
  error:any;
  showTryAgainBtn:boolean = false;
  ready:boolean = false;
  load:any;


  constructor(private modalController:ModalController,
    private http:HttpClient, private authGuard:AuthGuard, private loadingController:LoadingController) { 
  }


  ngOnInit() {
      try{
        this.wallet = JSON.parse(localStorage.getItem('wallet'));
        console.log('UpsertCategoryPage ngOnInit', this.mode);
        this.title = ((this.category == null) ? 'Add Category' : this.category.name);
        if(this.mode == 'edit') this.nameInput.nativeElement.value = this.category.name;
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


  async apply() {
      try{
          this.error = null;

          if(this.nameInput.nativeElement.value.length == 0){
            this.error =  'Please enter a caname.';
            this.showTryAgainBtn = false;
            this.error = 'Please enter a category name.';
            return;
          }
          await this.presentLoading(); // wait for it so it exists, otehwise it may still be null when finally runs
          
          //this.loading = true;
          let headers = new HttpHeaders();
          headers = headers.set('Authorization', 'Bearer '+this.authGuard.getUser()['token']);
          headers = headers.set('wallet',  JSON.stringify(this.wallet));

          if(this.mode == 'insert'){
            var result = await this.http.post(BACKEND.url+'/categories', 
              {name:this.nameInput.nativeElement.value}, {headers: headers} ).pipe(timeout(5000)).toPromise();
          }
          else{
            var result = await this.http.patch(BACKEND.url+'/ategories/'+this.category.id, 
              {name:this.nameInput.nativeElement.value}, {headers: headers} ).pipe(timeout(5000)).toPromise();
          }
          this.category = result['expense'];
          this.modalController.dismiss({category:this.category, mode:this.mode});
      }
      catch(err){
        this.showTryAgainBtn = true;
        this.error = err;
      }
      finally{
        this.load.dismiss();
      }
  };


  async presentLoading() {
    this.load = await this.loadingController.create({
      message: 'Submitting changes please wait...',
      keyboardClose:true,
      showBackdrop:true
    });
    await this.load.present();
    //const { role, data } = await this.load.onDidDismiss();
    //console.log('Loading dismissed!');
  }

}
