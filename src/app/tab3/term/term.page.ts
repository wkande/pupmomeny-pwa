import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { timeout } from 'rxjs/operators';



@Component({
  selector: 'app-term',
  templateUrl: './term.page.html',
  styleUrls: ['./term.page.scss'],
})

export class TermPage implements OnInit {


  termsHTML:any;

  constructor(private http:HttpClient) { }

  

  ngOnInit() {
    this.getTerms();
  }

    
  async getTerms(){
    this.http.get('assets/terms.html', { responseType: 'text' as 'json'}).subscribe((data:string) => {
      console.log(data.length);
      this.termsHTML = data;
    });
  }
}
