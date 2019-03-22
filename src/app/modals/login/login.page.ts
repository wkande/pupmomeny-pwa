import { Component, OnInit, Input  } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthGuard } from '../../services/auth.guard';
import { HttpClient } from '@angular/common/http';
import { timeout } from 'rxjs/operators';
import { BACKEND } from '../../../environments/environment';


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
  displayError:string = null;
  terms:boolean = false;
  segment:string = 'login'

  constructor(private modalController: ModalController, private authGuard:AuthGuard,
    private http: HttpClient) {

  }

  
  ngOnInit() {
      /*
        Input will contain the path to use upon success
      */
    console.log('@Input.path', this.path)
  }

  async next(){
    this.displayError = null;
    if(this.isValidMailFormat() == true){
        console.log('next', this.email);
        try{
          var result = await this.http.post(BACKEND.url+'/code', {email:this.email}).toPromise();
          this.code = result['data'].code;
          this.codeReady = true;
        }
        catch(err){
          console.log("ERROR:", err)
        }
    }
    else{
        this.displayError = "Invalid email address format."
    }
  }


  async submit() {
    console.log('next', this.email, this.code);
        try{
          var result = await this.http.post(BACKEND.url+'/me', {email:this.email, code:this.code}).pipe(timeout(5000)).toPromise();
          this.authGuard.activate(true, result['user']);
          this.modalController.dismiss({path:this.path});
        }
        catch(err){
          console.log("ERROR:", err)
        }
  };



  segmentChanged(ev){
    console.log(ev.detail.value)
    this.segment = ev.detail.value;
  }


  back(){
    this.codeReady = false;
    this.code = null;
  }


  isValidMailFormat(){
    var re = /\S+@\S+\.\S+/;
    return(re.test(this.email));
  }
  
}




