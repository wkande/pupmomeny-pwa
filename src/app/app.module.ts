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
//import { DecimalPipe } from '@angular/common';

import { LoginPage } from './modals/login/login.page';

import { FilterPage } from './modals/filter/filter.page';

// CurrencyComponentModule is needed here because it is part of login which loads of this module
import { CurrencyComponentModule } from './components/currency/currency.module';

// Imported at the tab level
//import { CategoriesPopoverComponent } from './components/categories/categories-popover/categories.popover.component';
//import { VendorsPopoverComponent } from './components/categories/vendors-popover/vendors.popover.component';

// NO MODALS 
// import { UpsertCategoryPage } from './tab1/upsert-category/upsert-category.page';
// import { DeleteCategoryPage } from './tab1/delete-category/delete-category.page';
// import { DeleteExpensePage } from './tab1/expenses/delete-expense/delete-expense.page';
// import { UpdateNamePage } from './tab3/update-name/update-name.page';
// import { UpdateEmailPage } from './tab3/update-email/update-email.page';




@NgModule({
  declarations: [AppComponent, FilterPage, LoginPage],
    
  entryComponents: [FilterPage, LoginPage],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, FormsModule, CurrencyComponentModule],
  providers: [
    HttpClientModule,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
