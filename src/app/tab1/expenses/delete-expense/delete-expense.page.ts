import { Component, OnInit, Input } from '@angular/core';
import { UtilsService } from '../../../services/utils/utils.service';
import { ModalController} from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthGuard } from '../../../services/auth.guard';
import { timeout } from 'rxjs/operators';
import { BACKEND } from '../../../../environments/environment';


@Component({
  selector: 'app-delete-expense',
  templateUrl: './delete-expense.page.html',
  styleUrls: ['./delete-expense.page.scss'],
})


export class DeleteExpensePage implements OnInit {


  errorDisplay:any;
  @Input("expense") expense:any;
  @Input("category") category:any;
  wallet:any;
  loading:boolean = false;


  constructor(private utilsService:UtilsService, private modalController:ModalController,
    private http:HttpClient, private authGuard:AuthGuard) { }

    ngOnInit() {
      try{
        this.wallet = JSON.parse(localStorage.getItem('wallet'));
        console.log('DeleteExpensePage ngOnInit', this.expense, this.category);
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
        this.errorDisplay = null;
        this.loading = true;
        let headers = new HttpHeaders();
        headers = headers.set('Authorization', 'Bearer '+this.authGuard.getUser()['token']);
        headers = headers.set('wallet',  JSON.stringify(this.wallet));

        console.log(BACKEND.url+'/categories/'+this.category.id+'/expenses/'+this.expense.id, {headers: headers} )
        var result = await this.http.delete('http://192.168.0.14:3000/categories/'+this.category.id+'/expenses/'+this.expense.id, {headers: headers} ).pipe(timeout(5000)).toPromise();
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
