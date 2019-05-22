import { Component, OnInit, Input  } from '@angular/core';
import { ModalController, LoadingController, NavController } from '@ionic/angular';
import { AuthGuard } from '../../services/auth.guard';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { timeout } from 'rxjs/operators';
import { BACKEND } from '../../../environments/environment';
import { UtilsService } from '../../services/utils/utils.service';
//@ts-ignore
const p = require('../../../../package.json');

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

  public json = {version:null};

  error:any = null;
  errorSupport:boolean = false;
  connectionTimeoutMsg:string = `There seems to be a connection issue, please try again.`;

  terms:boolean = false;
  segment:string = 'login';
  termsHTML:any;
  loadController:any;

  // Needs a default for the currency component to draw
  defaultWallet:any = {currency:{"curId":2, "symbol":"", "separator":",", "decimal":".", "precision": 2}};


  constructor(private modalController: ModalController, private authGuard:AuthGuard, private navCtrl:NavController,
    private http: HttpClient, private utils:UtilsService, private loadingController:LoadingController) {
  }

  
  ngOnInit() {
      /*
        Input will contain the path to use upon success
      */
    this.getTerms();
    this.json = p;
  }

  async getTerms(){
    this.http.get('assets/terms.html', { responseType: 'text' as 'json'}).subscribe((data:string) => {
      this.termsHTML = data;
    });
  }

  async next(){
    this.error = null;
    this.errorSupport = false;
    
    if(this.utils.isValidMailFormat(this.email) == true){
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
    this.error = null;
    let user:any;
        try{
          await this.presentLoading('Submitting code, please wait...'); // wait for it so it exists, otherwise it may still be null when finally runs
          var result = await this.http.post(BACKEND.url+'/me', {email:this.email, code:this.code}).pipe(timeout(5000)).toPromise();
          user = result['user'];
          this.authGuard.activate(true, user);

          // New Account, give the user a chance to change the percision for the default wallet
          if(user.newAccount){
            this.defaultWallet = JSON.parse(localStorage.getItem('wallet'));
            this.curId = this.defaultWallet.currency.curId.toString();
            this.segment = "percision";
          }
          else {
            this.modalController.dismiss({path:this.path});
          }

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
      if(this.defaultWallet.currency.curId != this.curId){
        let headers = new HttpHeaders();
        headers = headers.set('Authorization', 'Bearer '+this.authGuard.getUser()['token']);
        headers = headers.set('wallet',  JSON.stringify(this.defaultWallet));

        await this.presentLoading('Submitting currency formatting, please wait...'); // wait for it so it exists, otherwise it may still be null when finally runs
        var result = await this.http.patch(BACKEND.url+'/wallets/'+this.defaultWallet.id+'/currency', 
            {currency:currencyBody}, {headers: headers}).pipe(timeout(5000)).toPromise();
      }
          
      this.defaultWallet.currency = currencyBody;
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


  /**
   * @TODO get this to do its thing
   * @param ev 
   */
  selectedCurrency(ev:any){
      throw "OUCH we are here and doing nothing"
  }


  async presentLoading(msg:string) {
    this.loadController = await this.loadingController.create({
      message: msg,
      keyboardClose:true,
      showBackdrop:true
    });
    await this.loadController.present();
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


  componentError(ev:any){
    this.error = ev.toString();
  }

  
}




