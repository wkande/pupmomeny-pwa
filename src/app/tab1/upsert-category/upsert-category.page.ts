import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { UtilsService } from '../../services/utils/utils.service';
import { ModalController} from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthGuard } from '../../services/auth.guard';
import { timeout } from 'rxjs/operators';


@Component({
  selector: 'app-upsert-category',
  templateUrl: './upsert-category.page.html',
  styleUrls: ['./upsert-category.page.scss'],
})


export class UpsertCategoryPage implements OnInit {

  @ViewChild('nameInput') nameInput: ElementRef;
  errorDisplay:any;
  @Input("category") category:any;
  @Input("mode") mode:string;
  title:string;
  wallet:any;
  loading:boolean = false;


  constructor(private utilsService:UtilsService, private modalController:ModalController,
    private http:HttpClient, private authGuard:AuthGuard) { 
  }


  ngOnInit() {
      try{
        this.wallet = JSON.parse(localStorage.getItem('wallet'));
        console.log('UpsertCategoryPage ngOnInit', this.mode);

        this.title = ((this.category == null) ? 'Add Category' : this.category.name);
        if(this.mode == 'edit')
          this.nameInput.nativeElement.value = this.category.name;
      }
      catch(err){
        this.errorDisplay = this.utilsService.getErrorMessage(err);
      }
  }


  cancel(){
      this.modalController.dismiss(null)
  } 


  async apply() {
      try{
          if(this.nameInput.nativeElement.value.length == 0)
            throw 'Please enter a name.';

          this.errorDisplay = null;
          this.loading = true;
          let headers = new HttpHeaders();
          headers = headers.set('Authorization', 'Bearer '+this.authGuard.getUser()['token']);
          headers = headers.set('wallet',  JSON.stringify(this.wallet));

          if(this.mode == 'insert'){
            var result = await this.http.post('http://192.168.0.14:3000/expenses', 
              {name:this.nameInput.nativeElement.value}, {headers: headers} ).pipe(timeout(5000)).toPromise();
          }
          else{
            var result = await this.http.patch('http://192.168.0.14:3000/expenses/'+this.category.id, 
              {name:this.nameInput.nativeElement.value}, {headers: headers} ).pipe(timeout(5000)).toPromise();
          }
          this.category = result['expense'];
          this.modalController.dismiss({category:this.category, mode:this.mode});
      }
      catch(err){
          this.errorDisplay = this.utilsService.getErrorMessage(err);
      }
      finally{
          this.loading = false;
      }
  };


}
