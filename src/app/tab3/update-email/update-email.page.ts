import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController, Events } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthGuard } from '../../services/auth.guard';
import { timeout } from 'rxjs/operators';
import { BACKEND } from '../../../environments/environment';
import { delay } from 'rxjs/internal/operators'; // Testing only
import { UtilsService } from '../../services/utils/utils.service';


@Component({
  selector: 'app-update-email',
  templateUrl: './update-email.page.html',
  styleUrls: ['./update-email.page.scss'],
})


export class UpdateEmailPage implements OnInit {

  wallet:any;
  user:any;
  newEmail:string;
  code:string;
  codeReady:boolean = false;

  error:any;
  loading:any;
  showTryAgainBtn:boolean = false;


  constructor(private modalController:ModalController, private utils:UtilsService,
    private loadingController:LoadingController, private http:HttpClient, private authGuard:AuthGuard,
    private events:Events) { }


  ngOnInit() {
    this.wallet = JSON.parse(localStorage.getItem('wallet'));
    this.user = JSON.parse(localStorage.getItem('user'));
  }


  cancel(ev:any){
    this.modalController.dismiss(null)
  } 


  async sendCode(ev:any){
      try{
        if(!this.utils.isValidMailFormat(this.newEmail)){
          this.error = "Invalid email address format.";
          return;
        }

        await this.presentLoading('Sending a code, please wait...'); // wait for it so it exists, otherwise it may still be null when finally runs
        this.error = null;
        this.showTryAgainBtn = false;

        var result = await this.http.post(BACKEND.url+'/code', {email:this.newEmail}).pipe(timeout(5000), delay (this.utils.delayTimer)).toPromise();
        //@ts-ignore
        this.code = result.data.code;
        this.codeReady = true;
      }
      catch(err){
          this.error = this.utils.getErrorMessage(err);
          this.showTryAgainBtn = true;
      }
      finally{
        if(this.loading) this.loading.dismiss();
      }
  }


  async submit(ev:any) {
      try{
          await this.presentLoading('Submitting email, please wait...'); // wait for it so it exists, otherwise it may still be null when finally runs
          this.error = null;
          this.showTryAgainBtn = false;

          let headers = new HttpHeaders();
          headers = headers.set('Authorization', 'Bearer '+this.authGuard.getUser()['token']);
          headers = headers.set('wallet',  JSON.stringify(this.wallet));

          var result = await this.http.patch(BACKEND.url+'/user/email', 
            {code:this.code, new_email:this.newEmail}, {headers: headers} ).pipe(timeout(5000), delay (this.utils.delayTimer)).toPromise();

          //@ts-ignore
          this.user = result.user;
          this.authGuard.setUser(this.user);
          this.modalController.dismiss({email:this.user.email});
      }
      catch(err){
        if(err.status == 403){
          this.error = 'Invalid code. Please re-enter the code or go back and get another code.';
        }
        else {
          this.error = this.utils.getErrorMessage(err);
          this.showTryAgainBtn = true;
        }
        
      }
      finally{
        if(this.loading) this.loading.dismiss();
      }
  };


  back(ev:any){
    this.error = null;
    this.codeReady = false;
    this.code = null;
  }


  async presentLoading(msg:string) {
    this.loading = await this.loadingController.create({
      message: msg,
      keyboardClose:true,
      showBackdrop:true
    });
    await this.loading.present();
  }

}
