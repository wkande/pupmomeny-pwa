import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms'; // Needs to be imported so ngModel binds two-way

import { HttpClientModule, HttpHeaders } from '@angular/common/http';

import { LoginPage } from './modals/login/login.page';
import { FilterPage } from './modals/filter/filter.page';
import { UpsertCategoryPage } from './tab1/upsert-category/upsert-category.page';
import { DeleteCategoryPage } from './tab1/delete-category/delete-category.page';
import { DeleteExpensePage } from './tab1/expenses/delete-expense/delete-expense.page';





@NgModule({
  declarations: [AppComponent, FilterPage, LoginPage, UpsertCategoryPage, DeleteCategoryPage, DeleteExpensePage],
  entryComponents: [FilterPage, LoginPage, UpsertCategoryPage, DeleteCategoryPage, DeleteExpensePage],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, FormsModule],
  providers: [
    HttpClientModule,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
