import { Component, OnInit, Input  } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { AuthGuard } from '../../services/auth.guard';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { timeout } from 'rxjs/operators';
import { BACKEND } from '../../../environments/environment';
import { UtilsService } from '../../services/utils/utils.service';


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
  curId:string;
  currencies = [
    {"curId":0, "symbol":"", "separator":",", "decimal":".", "precision": 0},
    {"curId":1, "symbol":"", "separator":",", "decimal":".", "precision": 1},
    {"curId":2, "symbol":"", "separator":",", "decimal":".", "precision": 2},
    {"curId":3, "symbol":"", "separator":",", "decimal":".", "precision": 3},
    {"curId":4, "symbol":"", "separator":",", "decimal":".", "precision": 4},
    {"curId":5, "symbol":"", "separator":".", "decimal":",", "precision": 0},
    {"curId":6, "symbol":"", "separator":".", "decimal":",", "precision": 1},
    {"curId":7, "symbol":"", "separator":".", "decimal":",", "precision": 2},
    {"curId":8, "symbol":"", "separator":".", "decimal":",", "precision": 3},
    {"curId":9, "symbol":"", "separator":".", "decimal":",", "precision": 4},
  ];

  error:any = null;
  errorSupport:boolean = false;
  connectionTimeoutMsg:string = `There seems to be a connection issue, please try again.`;

  terms:boolean = false;
  segment:string = 'login';
  termsHTML:any;
  loadController:any;

  defaultWallet:any;

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
        try{
          await this.presentLoading('Sending a code, please wait...'); // wait for it so it exists, otherwise it may still be null when finally runs
          var result = await this.http.post(BACKEND.url+'/code', {email:this.email}).pipe(timeout(5000)).toPromise();
          this.code = result['data'].code;
          this.codeReady = true;
        }
        catch(err){
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


  async login() {
    console.log('next', this.email, this.code, BACKEND);
    this.error = null;
    let user:any;
        try{
          await this.presentLoading('Submitting code, please wait...'); // wait for it so it exists, otherwise it may still be null when finally runs
          var result = await this.http.post(BACKEND.url+'/me', {email:this.email, code:this.code}).pipe(timeout(5000)).toPromise();
          user = result['user'];
          this.authGuard.activate(true, user);
          console.log('LOGIN >', user)

          // New Account, give the user a chance to change the percision for the default wallet
          if(user.newAccount){
            this.defaultWallet = JSON.parse(localStorage.getItem('wallet'));
            this.curId = this.defaultWallet.currency.curId.toString();
            console.log(42, localStorage.getItem('wallet'))
            console.log(43, typeof this.curId, this.curId, this.defaultWallet.currency)
            this.segment = "percision";
          }
          else this.modalController.dismiss({path:this.path});

        }
        catch(err){
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


  async setCurrency(ev:any){
    this.error = null;
    try{
      // Only need to send if the percision has changed
      let currencyBody = this.currencies[this.curId]
      console.log(44, currencyBody, this.defaultWallet.currency)
      if(this.defaultWallet.currency.curId != this.curId){
        let headers = new HttpHeaders();
        headers = headers.set('Authorization', 'Bearer '+this.authGuard.getUser()['token']);
        headers = headers.set('wallet',  JSON.stringify(this.defaultWallet));

        await this.presentLoading('Submitting currency formatting, please wait...'); // wait for it so it exists, otherwise it may still be null when finally runs
        var result = await this.http.patch(BACKEND.url+'/wallets/'+this.defaultWallet.id+'/currency', 
            {currency:currencyBody}, {headers: headers}).pipe(timeout(5000)).toPromise();
      }
          
      this.defaultWallet.currency = currencyBody;
      console.log(45, currencyBody, this.defaultWallet.currency)
      localStorage.setItem('wallet', JSON.stringify(this.defaultWallet));
      this.modalController.dismiss({path:this.path});
    }
    catch(err){
        this.error = this.utils.getErrorMessage(err);
        this.errorSupport = true;
    }
    finally{
      this.loadController.dismiss();
    }

  }


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


  segmentChanged(ev:any){
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




