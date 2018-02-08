import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { IntroPage } from '../pages/intro/intro';
import { CreateAccountPage } from '../pages/create-account/create-account';
import { LoginPage } from '../pages/login/login';
import { SelectAnAccountPage } from '../pages/select-an-account/select-an-account';
import { OverviewPage } from '../pages/overview/overview';
import { AddExpensePage } from '../pages/add-expense/add-expense';
import { AddIncomePage } from '../pages/add-income/add-income';
import { EditLedgerPage } from '../pages/edit-ledger/edit-ledger';
import { ViewAttachmentPage } from '../pages/view-attachment/view-attachment';
import { SnapclerkPage } from '../pages/snapclerk/snapclerk';



import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    IntroPage,
    CreateAccountPage,
    LoginPage,
    SelectAnAccountPage,
    OverviewPage, 
    AddExpensePage,
    AddIncomePage,
    EditLedgerPage,
    ViewAttachmentPage,
    SnapclerkPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    IntroPage,
    CreateAccountPage,
    LoginPage,
    SelectAnAccountPage,
    OverviewPage, 
    AddExpensePage,
    AddIncomePage,
    EditLedgerPage,
    ViewAttachmentPage,
    SnapclerkPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
