import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, Events} from '@ionic/angular';


@Component({
  selector: 'app-filter',
  templateUrl: './filter.page.html',
  styleUrls: ['./filter.page.scss'],
})
export class FilterPage implements OnInit {


  filter:any = {}; // {parent:'btnThisMonth',
                      //  start:'2019-03-08', end:'2019-03-10', searchToggle:true, text:'HELLO'
                      // };
  hideDateRange:boolean = true;


  constructor(private modalController: ModalController, 
    private alertController:AlertController, private events: Events) { 
  }


  ngOnInit() {
    this.filter = JSON.parse(localStorage.getItem("filter"));
    // It is always possible that the filter got removed from localstorage
    if(!this.filter){
        this.filter =  {tag:'btnThisMonth', range:{start:null, end:null}, search:{toggle:false, text:null}};
        localStorage.setItem("filter", JSON.stringify(this.filter));
    }
    if(this.filter.tag == 'btnDateRange') this.hideDateRange = false;
    console.log('FilterPage.onInit >', this.filter);
  }


  async apply() {
        try{
            // If btnDateRange make sure start <= end
            if (this.filter.tag == 'btnDateRange'){
                let start = new Date(this.filter.range.start);
                let end = new Date(this.filter.range.end);
                if(start > end){
                  this.presentAlert('Date Problem', 'The start date cannot be before the end date.');
                  return;
                } 
            }

            // Save to localStorage
            console.log('filter.page > apply', this.filter)
            localStorage.setItem("filter", JSON.stringify(this.filter));

            // Send app wide event notice
            this.events.publish('redraw', this.filter);

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
        this.filter.tag = 'btnDateRange';
    }

    // Show start/end dates if btnDateRange is the parent
    if (event.detail.value.indexOf('btn') > -1){
      this.hideDateRange = ((event.detail.value == "btnDateRange") ? false : true);
    } 
  }


  selected(event:any, btn:string, slot:string){
      this.filter.search.start = ((slot == "start") ? event.detail.value : this.filter.search.start);
      this.filter.search.end = ((slot == "end") ? event.detail.value : this.filter.search.end);
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
