import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { timeout } from 'rxjs/operators';
import { AuthGuard } from '../services/auth.guard';
import { ModalController, Events } from '@ionic/angular';
import { FilterPage } from '../modals/filter/filter.page';
import { FilterService } from '../services/filter.service';
import { UtilsService } from '../services/utils/utils.service';
import { CacheService } from '../services/cache/cache.service';
import { Decimal } from 'decimal.js';
import { UpsertCategoryPage } from './categories/upsert-category/upsert-category.page';
import { DeleteCategoryPage } from './categories/delete-category/delete-category.page';
import { BACKEND } from '../../environments/environment';
import { delay } from 'rxjs/internal/operators'; // Testing only


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})


export class Tab1Page {
  wallet:object;
  categories:any;
  error:any;
  dttmStart:string;
  dttmEnd:string;
  total:any = 0;
  sumTotal = 0; // Number of trasnactions
  num:string = "2";
  filter:any;
  loading:boolean = true;
  presentLoader:boolean = true;


  constructor(private http: HttpClient, private authGuard:AuthGuard, private modalController:ModalController,
    private filterService:FilterService, private events: Events, 
    private utils:UtilsService, private cache:CacheService) {
      console.log('>>>>>>>>>>>>>>>> Tab1Page.constructor <<<<<<<<<<<<<<<<<')
  }


  ngOnInit(){
    try{
      console.log('>>>>>>>>>>>>>>>> Tab1Page.ngOnInit <<<<<<<<<<<<<<<<<')
      this.wallet = JSON.parse(localStorage.getItem('wallet'));
      this.getCategories(); 

      this.events.subscribe('filter-changed', (data) => {
          try{
            console.log('Tab1Page > ngOnInit > subscribe > fired > filter-changed');
            this.getCategories();
          }
          catch(err){
            this.error = err;
          }
      });
      this.events.subscribe('dml', (data) => {
          try{
            console.log('Tab1Page > ngOnInit > subscribe > fired > dml');
            this.getCategories();
          }
          catch(err){
            this.error = err;
          }
      });
    }
    catch(err){
      this.error = err;
    }
  }


  tryAgain(ev:any){
    console.log('tryAgain')
    this.getCategories();
  }


  async getCategories(){
    try{
      console.log('>>> TAB1 > getCategories')
      this.error = null;
      this.loading = true;
      this.total = 0;
      this.sumTotal = 0;
      this.categories = [];
      this.filter = this.filterService.getFilter();
      
      let headers = new HttpHeaders();
      headers = headers.set('Authorization', 'Bearer '+this.authGuard.getUser()['token']);
      headers = headers.set('wallet',  JSON.stringify(this.wallet));

      let q = this.utils.formatQ(  ((this.filter.search.toggle) ? this.filter.search.text : '')  );
      //console.log('Tab1Page.getExpenses >  q', q)

      var result = await this.http.get(BACKEND.url+'/categories?q='+q+'&dttmStart='+this.filter.range.start+'&dttmEnd='+this.filter.range.end, {headers: headers})
      .pipe(timeout(15000), delay (this.utils.delayTimer))
      .toPromise();
      //console.log(result)
      this.categories = result['categories'];
      
      // floating point arithmetic is not always 100% accurate, use Decimals
      this.total = new Decimal(0);
      for(var i=0; i<this.categories.length; i++){
        this.sumTotal += this.categories[i].sum.cnt;
        this.total = Decimal.add(this.total, this.categories[i].sum.amt);
      }

      this.total = parseFloat(this.total.toString());
      this.cache.categories = this.categories;
      
    }
    catch(err){
      this.error = err;
    }
    finally{
      this.loading = false;
    }
  }


  async presentFilterModal(ev:any) {
      try{
          const modal = await this.modalController.create({
            component: FilterPage
          });
          await modal.present();

          const { data } = await modal.onDidDismiss();
      }
      catch(err){
        this.error = err;
      } 
  }
  

  async presentUpsertModal(category:any, mode:string) {
    try{
        this.error = null;
        console.log('Tab1Page > presentUpsertCategoryModal()', category)
        const modal = await this.modalController.create({
          component: UpsertCategoryPage,
          componentProps: { category: category, mode:mode },
          showBackdrop:true,
          backdropDismiss:false
        });
        await modal.present();
        const { data } = await modal.onDidDismiss();
    }
    catch(err){
      this.error = err;
    } 
  }



  async presentDeleteModal(category:any) {
    try{
        this.error = null;
        console.log('Tab1Page:presentDeleteModal()', category)
        const modal = await this.modalController.create({
          component: DeleteCategoryPage,
          componentProps: { category: category, categories:this.categories }
        });
        await modal.present();
        const { data } = await modal.onDidDismiss();
        console.log('Tab1Page:presentDeleteModal():dismissed');
    }
    catch(err){
      this.error = err;
    } 
  }


  doRefresh(event:any) {
    console.log('Begin refresh async operation');
    this.getCategories();

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 200);
  }


}
