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


  errorDisplay:any;
  errorDisplayEntry:any;
  @Input("category") category:any;
  @Input("categories") categories:any;
  categoriesList = [];
  //title:string;
  wallet:any;
  loading:boolean = false;
  transactionCnt:number;
  radioSelection:string;
  moveTo:string = '0';



  constructor(private utilsService:UtilsService, private modalController:ModalController,
    private http:HttpClient, private authGuard:AuthGuard) { }

  ngOnInit() {
      try{
        this.wallet = JSON.parse(localStorage.getItem('wallet'));
        console.log('DeleteCategoryPage ngOnInit', this.category);
        //this.title = ((this.category == null) ? 'Delete Category' : this.category.name);

        this.getCategory();

        // Create deep coy without the category to be deleted
        for(let i=0; i<this.categories.length; i++){
           if(this.categories[i].id != this.category.id){
            this.categoriesList.push(this.categories[i]);
           }
        }
      }
      catch(err){
        this.errorDisplay = this.utilsService.getErrorMessage(err);
      }
  }


  cancel(){
      this.modalController.dismiss(null)
  } 


  radioChanged(ev:any){
    this.errorDisplayEntry = null;
  }


  async getCategory(){
    try{
      
      this.errorDisplay = null;
      this.errorDisplayEntry = null;
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
        this.errorDisplayEntry = null;
        console.log('APPLY', this.radioSelection, this.moveTo, this.categories)
        let transferID = "";
        if(this.radioSelection == "move"){
          console.log('MOVE')
            if(this.moveTo == "0") {
              this.errorDisplayEntry = this.utilsService.getErrorMessage(`Please select an category to move expenses to. See "Move to Category" below.`);
              return;
            }
            else 
              transferID = "/"+this.moveTo;
        }
        console.log(transferID)

        this.errorDisplay = null;
        this.loading = true;
        let headers = new HttpHeaders();
        headers = headers.set('Authorization', 'Bearer '+this.authGuard.getUser()['token']);
        headers = headers.set('wallet',  JSON.stringify(this.wallet));

        console.log('http://192.168.0.14:3000/expenses/'+this.category.id+transferID, {headers: headers} )
        var result = await this.http.delete('http://192.168.0.14:3000/expenses/'+this.category.id+transferID, {headers: headers} ).pipe(timeout(5000)).toPromise();
        this.modalController.dismiss({status:"OK"});
    }
    catch(err){
        this.errorDisplay = this.utilsService.getErrorMessage(err);
    }
    finally{
        this.loading = false;
    }
  };

  moveToCategory(id){
      this.moveTo = id;
      console.log('move to', this.moveTo)
  }

}
