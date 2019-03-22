import { Component, OnInit } from '@angular/core';
import { ModalController} from '@ionic/angular';


@Component({
  selector: 'app-update-email',
  templateUrl: './update-email.page.html',
  styleUrls: ['./update-email.page.scss'],
})


export class UpdateEmailPage implements OnInit {

  constructor(private modalController:ModalController) { }

  ngOnInit() {
  }



  cancel(){
    this.modalController.dismiss(null)
} 


async apply() {
    /*try{
        if(this.nameInput.nativeElement.value.length == 0)
          throw 'Please enter a name.';

        this.errorDisplay = null;
        this.loading = true;
        let headers = new HttpHeaders();
        headers = headers.set('Authorization', 'Bearer '+this.authGuard.getUser()['token']);
        headers = headers.set('wallet',  JSON.stringify(this.wallet));

        if(this.mode == 'insert'){
          var result = await this.http.post(BACKEND.url+'/categories', 
            {name:this.nameInput.nativeElement.value}, {headers: headers} ).pipe(timeout(5000)).toPromise();
        }
        else{
          var result = await this.http.patch(BACKEND.url+'/categories/'+this.category.id, 
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
    }*/
};

}
