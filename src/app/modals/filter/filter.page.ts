import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, Events} from '@ionic/angular';


@Component({
  selector: 'app-filter',
  templateUrl: './filter.page.html',
  styleUrls: ['./filter.page.scss'],
})
export class FilterPage implements OnInit {

  selection:any = {}; // {parent:'btnThisMonth',
                      //  start:'2019-03-08', end:'2019-03-10',
                      //  searchToggle:true, text:'HELLO'};
  hideDateRange:boolean = true;


  constructor(private modalController: ModalController, 
    private alertController:AlertController, private events: Events) { 

  }


  ngOnInit() {
    this.selection = JSON.parse(localStorage.getItem("filter"));
    if(this.selection.parent == 'btnDateRange') this.hideDateRange = false;

    console.log('FilterPage.onInit >', this.selection);
  }


  async apply() {
        try{
            // If btnDateRange make sure start <= end
            if (this.selection.parent == 'btnDateRange'){
                let start = new Date(this.selection.start);
                let end = new Date(this.selection.end);
                if(start > end){
                  this.presentAlert('Date Problem', 'The start date cannot be before the end date.');
                  return;
                } 
            }

            // Save to localStorage
            console.log('filter.page > apply', this.selection)
            localStorage.setItem("filter", JSON.stringify(this.selection));

            // Send app wide event notice
            this.events.publish('filter-changed', this.selection);

            this.modalController.dismiss();
        }
        catch(err){
            console.log('FILTER PAGE APPLY', err)
            throw err;
        }
  };


  changed(event:any){
    // changed() fires after selected() and if a date range start/end changed we 
    // need change the selection.parent back to btnDateRange
    if (event.detail.value.indexOf('btn') == -1){
        this.selection.parent = 'btnDateRange';
    }

    // Show start/end dates if btnDateRange is the parent
    if (event.detail.value.indexOf('btn') > -1){
      this.hideDateRange = ((event.detail.value == "btnDateRange") ? false : true);
    } 
  }


  selected(event:any, btn:string, slot:string){
      this.selection.start = ((slot == "start") ? event.detail.value : this.selection.start);
      this.selection.end = ((slot == "end") ? event.detail.value : this.selection.end);
  }


  cancel(){
      this.modalController.dismiss({})
  } 


  async presentAlert(subtitle:string, message:string) {
      const alert = await this.alertController.create({
        header: 'Alert',
        subHeader: subtitle,
        message: message,
        buttons: ['OK']
      });

      await alert.present();
  }

}
