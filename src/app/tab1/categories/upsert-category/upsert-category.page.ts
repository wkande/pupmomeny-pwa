import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ModalController, LoadingController, Events} from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthGuard } from '../../../services/auth.guard';
import { timeout } from 'rxjs/operators';
import { BACKEND } from '../../../../environments/environment';
import { delay } from 'rxjs/internal/operators'; // Testing only
import { UtilsService } from '../../../services/utils/utils.service';


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
  loading:any;


  constructor(private modalController:ModalController,
    private http:HttpClient, private authGuard:AuthGuard, private loadingController:LoadingController,
    private utils:UtilsService, private events:Events) { 
  }


  ngOnInit() {
      try{
        this.wallet = JSON.parse(localStorage.getItem('wallet'));
        //console.log('UpsertCategoryPage ngOnInit', this.mode);
        this.title = ((this.category == null) ? 'Add Category' : 'Edit Category');
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


  async apply(ev:any) {
      try{
          this.error = null;
          this.showTryAgainBtn = false;

          // Remove leading/trailng spaces
          if(this.nameInput.nativeElement.value) this.nameInput.nativeElement.value = this.nameInput.nativeElement.value.trim();
          if(this.nameInput.nativeElement.value.length == 0){
            this.error = 'Please enter a category name.';
            return;
          }
          await this.presentLoading(); // wait for it so it exists, otherwise it may still be null when finally runs
          
          let headers = new HttpHeaders();
          headers = headers.set('Authorization', 'Bearer '+this.authGuard.getUser()['token']);
          headers = headers.set('wallet',  JSON.stringify(this.wallet));

          if(this.mode == 'insert'){
            var result = await this.http.post(BACKEND.url+'/categories', 
              {name:this.nameInput.nativeElement.value}, {headers: headers} ).pipe(timeout(5000), delay (this.utils.delayTimer)).toPromise();
          }
          else{
            var result = await this.http.patch(BACKEND.url+'/categories/'+this.category.id+'/name', 
              {name:this.nameInput.nativeElement.value}, {headers: headers} ).pipe(timeout(5000), delay (this.utils.delayTimer)).toPromise();
          }
          this.category = result['expense'];
          this.events.publish('redraw', {category:this.category, mode:this.mode});
          this.modalController.dismiss( {status:"OK"});
      }
      catch(err){
        if(JSON.stringify(err).indexOf('duplicate key value') != -1){
          this.error = 'That category name is already in use. Please enter a different one.';
        }
        else{
          this.showTryAgainBtn = true;
          this.error = err;
        }
      }
      finally{
        if(this.loading) this.loading.dismiss();
      }
  };


  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Submitting changes, please wait...',
      keyboardClose:true,
      showBackdrop:true
    });
    await this.loading.present();

  }

}
