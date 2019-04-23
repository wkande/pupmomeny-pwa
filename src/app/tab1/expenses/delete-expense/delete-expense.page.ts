import { Component, OnInit, Input } from '@angular/core';
import { UtilsService } from '../../../services/utils/utils.service';
import { ModalController, AlertController, LoadingController, Events} from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthGuard } from '../../../services/auth.guard';
import { timeout } from 'rxjs/operators';
import { BACKEND } from '../../../../environments/environment';
import { delay } from 'rxjs/internal/operators'; // Testing only


@Component({
  selector: 'app-delete-expense',
  templateUrl: './delete-expense.page.html',
  styleUrls: ['./delete-expense.page.scss'],
})


export class DeleteExpensePage implements OnInit {


  error:any;
  showTryAgainBtn:boolean = false;
  loadCtlr:any;
  ready:boolean = false;

  @Input("expense") expense:any;
  @Input("category") category:any;
  wallet:any;


  constructor(private utilsService:UtilsService, private modalController:ModalController,
    private http:HttpClient, private authGuard:AuthGuard, private alertController:AlertController,
    private loadingController:LoadingController, private events:Events) { }


  ngOnInit() {
      try{
        this.wallet = JSON.parse(localStorage.getItem('wallet'));
        console.log('DeleteExpensePage ngOnInit', this.expense, this.category);
        this.ready = true;
      }
      catch(err){
        this.error = err;
      }
  }



  cancel(){
    this.modalController.dismiss(null)
  } 


  async apply() {
    try{
        this.error = null;
        this.showTryAgainBtn = false;

        await this.presentLoading(); // wait for it so it exists, otherwise it may still be null when finally runs

        let headers = new HttpHeaders();
        headers = headers.set('Authorization', 'Bearer '+this.authGuard.getUser()['token']);
        headers = headers.set('wallet',  JSON.stringify(this.wallet));

        var result = await this.http.delete(BACKEND.url+'/categories/'+this.category.id+'/expenses/'+this.expense.id, {headers: headers} )
          .pipe(timeout(5000), delay(this.utilsService.delayTimer)).toPromise();
        this.events.publish('redraw', {expense:this.expense, mode:'delete'});
        this.modalController.dismiss({status:"OK"});
    }
    catch(err){
        this.error = err;
        this.showTryAgainBtn = true;
    }
    finally{
        this.loadCtlr.dismiss();
    }
  };


  async presentAlertConfirm() {
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
            this.apply();
          }
        }
      ]
    });
    await alert.present();
  }


  async presentLoading() {
    this.loadCtlr = await this.loadingController.create({
      message: 'Deleting, please wait...',
      keyboardClose:true,
      showBackdrop:true
    });
    await this.loadCtlr.present();

  }

}
