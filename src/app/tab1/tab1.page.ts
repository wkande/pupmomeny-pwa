import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { timeout } from 'rxjs/operators';
import { AuthGuard } from '../services/auth.guard';
import { ModalController, NavController, Events, LoadingController } from '@ionic/angular';
import { FilterPage } from '../modals/filter/filter.page';
import { FilterService } from '../services/filter.service';
import { UtilsService } from '../services/utils/utils.service';
import { Decimal } from 'decimal.js';
import { UpsertCategoryPage } from './upsert-category/upsert-category.page';
import { DeleteCategoryPage } from './delete-category/delete-category.page';
import { BACKEND } from '../../environments/environment';


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
  total:any;
  num:string = "2";
  filter:any;
  load:any;

  /*cur = {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  };*/

  //formatter = new Intl.NumberFormat('en-US', this.cur);



  constructor(private http: HttpClient, private authGuard:AuthGuard, private modalController:ModalController,
    private filterService:FilterService, private events: Events, private navController:NavController,
    private utilsService:UtilsService, private loadingController:LoadingController) {

  }


  ngOnInit(){
    try{
      this.wallet = JSON.parse(localStorage.getItem('wallet'));
      this.filter = this.filterService.getFilter();
      this.getCategories(); 

      this.events.subscribe('filter-changed', (data) => {
          try{
            this.error = null;
            console.log('Tab1Page > ngOnInit > subscribe > fired > filter-changed');
            this.filter = this.filterService.getFilter();
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


  tryAgain(ev){
    console.log('tryAgain')
    this.getCategories();
  }


 


  async getCategories(){
    
    try{
      await this.presentLoading(); // wait for it so it exists, otehwise it may still be null when finally runs
      this.categories = [];
      
      let headers = new HttpHeaders();
      headers = headers.set('Authorization', 'Bearer '+this.authGuard.getUser()['token']);
      headers = headers.set('wallet',  JSON.stringify(this.wallet));

      let q = this.utilsService.formatQ(  ((this.filter.search.toggle) ? this.filter.search.text : '')  );
      console.log('Tab1Page.getExpenses >  q', q, BACKEND.url)

      var result = await this.http.get(BACKEND.url+'/categories?q='+q+'&dttmStart='+this.filter.range.start+'&dttmEnd='+this.filter.range.end, {headers: headers})
      .pipe(timeout(5000))
      .toPromise();
      console.log(result)
      this.categories = result['categories'];

      // floating point arithmetic is not always 100% accurate, use Decimals
      this.total = new Decimal(0);
      for(var i=0; i<this.categories.length; i++){
        this.total = Decimal.add(this.total, this.categories[i].sum.amt);
      }
      this.total = parseFloat(this.total.toString());
      this.error = null;
    }
    catch(err){
      this.error = err;
    }
    finally{
      this.load.dismiss();
    }
  }


  async presentFilterModal() {
    const modal = await this.modalController.create({
      component: FilterPage
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    console.log('Tab1Page:presentFilterModal():dismissed');
  }
  

  async presentLoading() {
    this.load = await this.loadingController.create({
      message: 'Getting categories please wait...',
      keyboardClose:true,
      showBackdrop:true
    });
    await this.load.present();
    //const { role, data } = await this.load.onDidDismiss();
    //console.log('Loading dismissed!');
  }


  async presentUpsertModal(category:any, mode:string) {
    try{
        this.error = null;
        console.log('Tab1Page:presentUpsertModal()', category)
        const modal = await this.modalController.create({
          component: UpsertCategoryPage,
          componentProps: { category: category, mode:mode }
        });
        await modal.present();
        
        const { data } = await modal.onDidDismiss();
        console.log('Tab1Page:presentUpsertModal():dismissed: data',data);

        // Reload
        if(data != null){
          this.filter = this.filterService.getFilter();
          this.getCategories();
        }
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

        // Reload
        if(data != null){
          this.filter = this.filterService.getFilter();
          this.getCategories();
        }
    }
    catch(err){
      this.error = err;
    } 
  }


  doRefresh(event) {
    console.log('Begin async operation');
    this.filter = this.filterService.getFilter();
    this.getCategories();

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 200);
  }


}
