import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { UtilsService } from '../../services/utils/utils.service';
import { ModalController} from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthGuard } from '../../services/auth.guard';
import { timeout } from 'rxjs/operators';


@Component({
  selector: 'app-delete-category.page',
  templateUrl: './delete-category.page.html',
  styleUrls: ['./delete-category.page.scss'],
})
export class DeleteCategoryPage implements OnInit {


  //@ViewChild('nameInput') nameInput: ElementRef;
  errorDisplay:any;
  @Input("category") category:any;
  title:string;
  wallet:any;
  loading:boolean = false;
  transactionCnt:number;


  constructor(private utilsService:UtilsService, private modalController:ModalController,
    private http:HttpClient, private authGuard:AuthGuard) { }

  ngOnInit() {
      try{
        this.wallet = JSON.parse(localStorage.getItem('wallet'));
        console.log('DeleteCategoryPage ngOnInit', this.category);
        this.title = ((this.category == null) ? 'Delete Category' : this.category.name);

        this.getCategory();
      }
      catch(err){
        this.errorDisplay = this.utilsService.getErrorMessage(err);
      }
  }


  cancel(){
      this.modalController.dismiss(null)
  } 



  async getCategory(){
    try{
      this.errorDisplay = null;
      this.loading = true;
      let headers = new HttpHeaders();
      headers = headers.set('Authorization', 'Bearer '+this.authGuard.getUser()['token']);
      headers = headers.set('wallet',  JSON.stringify(this.wallet));
  
      var result = await this.http.get('http://192.168.0.14:3000/expenses/'+this.category.id, {headers: headers} ).pipe(timeout(5000)).toPromise();
      this.category = result['expense'];
      console.log(result)
      this.transactionCnt = result['transactionCnt'];
    }
    catch(err){
      this.errorDisplay = this.utilsService.getErrorMessage(err);
    }
    finally{
        this.loading = false;
    }
    
  }


  async apply() {
    try{
        this.errorDisplay = null;
        this.loading = true;
        let headers = new HttpHeaders();
        headers = headers.set('Authorization', 'Bearer '+this.authGuard.getUser()['token']);
        headers = headers.set('wallet',  JSON.stringify(this.wallet));

        var result = await this.http.delete('http://192.168.0.14:3000/expenses/'+this.category.id, {headers: headers} ).pipe(timeout(5000)).toPromise();
        this.modalController.dismiss({status:"OK"});
    }
    catch(err){
        this.errorDisplay = this.utilsService.getErrorMessage(err);
    }
    finally{
        this.loading = false;
    }
};

}
