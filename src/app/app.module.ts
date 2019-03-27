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
import { CategoriesPopoverComponent } from './components/categories/categories-popover/categories.popover.component';

// NO MODALS 
// import { UpsertCategoryPage } from './tab1/upsert-category/upsert-category.page';
// import { DeleteCategoryPage } from './tab1/delete-category/delete-category.page';
// import { DeleteExpensePage } from './tab1/expenses/delete-expense/delete-expense.page';


// ? Do we need these here
import { UpdateNamePage } from './tab3/update-name/update-name.page';
import { UpdateEmailPage } from './tab3/update-email/update-email.page';



@NgModule({
  declarations: [AppComponent, FilterPage, LoginPage, UpdateNamePage, UpdateEmailPage, CategoriesPopoverComponent],
    
  entryComponents: [FilterPage, LoginPage, UpdateNamePage, UpdateEmailPage, CategoriesPopoverComponent],
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
