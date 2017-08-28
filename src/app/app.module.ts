import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { GlobalData } from "../providers/GlobalData";
import { NativeService } from "../providers/NativeService";
import { StorageService } from '../providers/StorageService';

import { MyApp } from './app.component';
import { AppConfig } from "./app.config";

import { HomePage } from '../pages/home/home';

import { HttpServiceProvider } from "../providers/http-service";
import { QueryService } from "../pages/home/queryService";
@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    HttpServiceProvider,
    QueryService,
    NativeService,
    StorageService,
    GlobalData,
    AppConfig,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
