import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { timeout } from 'rxjs/operators';



@Component({
  selector: 'app-term',
  templateUrl: './term.page.html',
  styleUrls: ['./term.page.scss'],
})

export class TermPage implements OnInit {


  terms:any;

  constructor(private http:HttpClient) { }


  ngOnInit() {
    this.getTerms();
  }

  async getTerms(){



    var result = await this.http.get('http://192.168.3.44:8080/terms')
      .pipe(timeout(5000))
      .toPromise();
      this.terms = result;
      //console.log(JSON.parse(result))
      //this.categories = result['categories'];
  }
}
