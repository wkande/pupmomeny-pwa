import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController} from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthGuard } from '../../services/auth.guard';
import { timeout } from 'rxjs/operators';
import { BACKEND } from '../../../environments/environment';
import { delay } from 'rxjs/internal/operators'; // Testing only
import { UtilsService } from '../../services/utils/utils.service';



@Component({
  selector: 'app-update-name',
  templateUrl: './update-name.page.html',
  styleUrls: ['./update-name.page.scss'],
})


export class UpdateNamePage implements OnInit {


  user:any;
  error:any;
  loading:any;
  wallet:any;
  showTryAgainBtn:boolean = false;


  constructor(private modalController:ModalController, private loadingController:LoadingController,
    private utils:UtilsService, private authGuard:AuthGuard, private http:HttpClient) { }


  ngOnInit() {
    this.wallet = JSON.parse(localStorage.getItem('wallet'));
    this.user = JSON.parse(localStorage.getItem('user'));
  }


  cancel(){
    this.modalController.dismiss(null)
  } 


  tryAgain(ev:any){
    this.apply();
  }


  async apply() {
  console.log(this.user.name)
      try{
          if(this.user.name.length == 0) throw 'Please enter a name.';
          this.error = null;
          this.loading = true;
          this.showTryAgainBtn = false;

          await this.presentLoading(); // wait for it so it exists, otherwise it may still be null when finally runs

          let headers = new HttpHeaders();
          headers = headers.set('Authorization', 'Bearer '+this.authGuard.getUser()['token']);
          headers = headers.set('wallet',  JSON.stringify(this.wallet));
          var result = await this.http.patch(BACKEND.url+'/user/name', 
              {name:this.user.name}, {headers: headers} ).pipe(timeout(5000), delay (this.utils.delayTimer)).toPromise();
          localStorage.setItem('user', JSON.stringify(this.user));
          this.modalController.dismiss({name:this.user.name});
      }
      catch(err){
          this.error = this.utils.getErrorMessage(err);
          this.showTryAgainBtn = true;
      }
      finally{
          this.loading.dismiss();
      }
  };


  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Submitting, please wait...',
      keyboardClose:true,
      showBackdrop:true
    });
    await this.loading.present();
  }

}
