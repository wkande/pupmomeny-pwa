import { Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import { ModalController, AlertController, PopoverController} from '@ionic/angular';
import { CategoriesPopoverComponent } from '../../../components/categories/categories-popover/categories.popover.component';

@Component({
  selector: 'app-upsert-expense',
  templateUrl: './upsert-expense.page.html',
  styleUrls: ['./upsert-expense.page.scss'],
})


export class UpsertExpensePage implements OnInit {

  @ViewChild('catPopoverBtn') catPopoverBtn: ElementRef;
  title:string = 'Insert';

  constructor(private modalController:ModalController, private popoverCtrl:PopoverController) { }


  ngOnInit() {
    console.log('ngOnInit', this.catPopoverBtn)
    //this.showCategories({srcElement:this.catPopoverBtn.el});
    let element: HTMLElement = document.getElementById('catPopoverBtn') as HTMLElement;
    console.log(1, element)
    element.click();
  }


  apply(ev:any){
    ;
  }

  cancel(){
    this.modalController.dismiss(null)
  } 


  async showCategories(ev: any) {
    console.log(2, ev)
    const popover = await this.popoverCtrl.create({
        component: CategoriesPopoverComponent,
        event: ev,
        animated: true,
        keyboardClose:true,
        showBackdrop: true
    });
    return await popover.present();
}

}
