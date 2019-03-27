import { Component, OnInit, Input  } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { AuthGuard } from '../../services/auth.guard';
import { HttpClient } from '@angular/common/http';
import { timeout } from 'rxjs/operators';
import { BACKEND } from '../../../environments/environment';
import { UtilsService } from '../../services/utils/utils.service'


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {


  @Input() path: string;
  email:string = null;
  code:string = null;
  codeReady:boolean = false;

  error:any = null;
  errorSupport:boolean = false;
  connectionTimeoutMsg:string = `There seems to be a connection issue, please try again.`;

  terms:boolean = false;
  segment:string = 'login';
  termsHTML:any;
  loadController:any;

  constructor(private modalController: ModalController, private authGuard:AuthGuard,
    private http: HttpClient, private utils:UtilsService, private loadingController:LoadingController) {

  }

  
  ngOnInit() {
      /*
        Input will contain the path to use upon success
      */
    console.log('@Input.path', this.path);
    this.getTerms();

    
  }

  async getTerms(){
    this.http.get('assets/terms.html', { responseType: 'text' as 'json'}).subscribe((data:string) => {
      console.log(data.length);
      this.termsHTML = data;
    });
  }

  async next(){
    this.error = null;
    this.errorSupport = false;
    
    if(this.isValidMailFormat() == true){
        console.log('next', this.email, BACKEND.url);
        try{
          await this.presentLoading('Sending code, please wait...'); // wait for it so it exists, otherwise it may still be null when finally runs

          var result = await this.http.post(BACKEND.url+'/code', {email:this.email}).toPromise();
          this.code = result['data'].code;
          this.codeReady = true;
        }
        catch(err){
          console.log("login next > ERROR:", err);
          if(err.status == 0){
            this.error = this.connectionTimeoutMsg;
            this.errorSupport = true;
          }
          else{
            this.error = this.utils.getErrorMessage(err);
            this.errorSupport = true;
          }
        }
        finally{
          this.loadController.dismiss();
        }
    }
    else{
        this.error = "Invalid email address format.";
    }
  }


  async submit() {
    console.log('next', this.email, this.code, BACKEND);
    this.error = null;
        try{
          await this.presentLoading('Submitting code, please wait...'); // wait for it so it exists, otherwise it may still be null when finally runs

          var result = await this.http.post(BACKEND.url+'/me', {email:this.email, code:this.code}).pipe(timeout(5000)).toPromise();
          this.authGuard.activate(true, result['user']);
          this.modalController.dismiss({path:this.path});
        }
        catch(err){
          console.log("Login submit > ERROR:", err.status)
          if(err.status == 0){
            this.error = this.connectionTimeoutMsg;
            this.errorSupport = true;
          }
          else if(err.status == 554){
            this.error = 'Invalid code. Please re-enter the code or go back and get another code.';
          }
          else{
            this.error = this.utils.getErrorMessage(err);
            this.errorSupport = true;
          }
        }
        finally{
          this.loadController.dismiss();
        }
  };


  async presentLoading(msg:string) {
    this.loadController = await this.loadingController.create({
      message: msg,
      keyboardClose:true,
      showBackdrop:true
    });
    await this.loadController.present();
    //const { role, data } = await this.load.onDidDismiss();
    //console.log('Loading dismissed!');
  }

  segmentChanged(ev){
    console.log(ev.detail.value)
    this.segment = ev.detail.value;
  }


  back(){
    this.error = null;
    this.errorSupport = false;
    this.codeReady = false;
    this.code = null;
  }


  isValidMailFormat(){
    var re = /\S+@\S+\.\S+/;
    return(re.test(this.email));
  }
  
}




