import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab3Page } from './tab3.page';

// ErrorModule child modals use it as well, though they also must declare it.
import { ErrorModule } from '../components/error/error.module';
import { UpdateNamePage } from './update-name/update-name.page';
import { UpdateEmailPage } from './update-email/update-email.page';
import { UpsertWalletPage } from './upsert-wallet/upsert-wallet.page';
import { SwitchWalletPage } from './switch-wallet/switch-wallet.page';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ErrorModule,
    RouterModule.forChild([
      { path: '', component: Tab3Page },
      { path: '/update-name', component: UpdateNamePage },
      { path: '/update-email', component: UpdateEmailPage },
      { path: '/upsert-wallet', component: UpsertWalletPage },
      { path: '/switch-wallet', component: SwitchWalletPage }])
  ],
  declarations: [Tab3Page, UpdateNamePage, UpdateEmailPage, UpsertWalletPage, SwitchWalletPage]
})
export class Tab3PageModule {}
