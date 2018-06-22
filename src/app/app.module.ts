import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
// 3d libraries

//local
import { LoginComponent } from './(1) Login/component/login/login.component';
import { LkComponent } from './(2) LK/component/lk/lk.component';
import { AppRoutingModule } from './res/shared/module/routing/app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Lk2Component } from './(2) LK/component/lk2/lk2.component';
import { TaskPageComponent } from './(2) LK/component/lk/subView/task-page/task-page.component';
import { TaskListComponent } from './(2) LK/component/lk/subView/task-list/task-list.component';
import { NotFoundComponent } from './(2) LK/component/lk/subView/not-found/not-found.component';

import {HttpClientModule} from '@angular/common/http';
import {ConnectModule} from './ConnectSystem/res/shared/module/connect.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from './res/shared/module/shared.module';
import { WorksTableComponent } from './(2) LK/component/lk/subView/works-table/works-table.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
// import {UcWidgetModule} from 'ngx-uploadcare-widget';
//
// const MOMENT_FORMATS = {
//   parse: {
//     dateInput: 'LL',
//   },
//   display: {
//     monthYearLabel: 'MMM YYYY',
//     // See DateFormats for other required formats.
//   },
// };


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LkComponent,
    Lk2Component,
    TaskPageComponent,
    TaskListComponent,
    NotFoundComponent,
    WorksTableComponent

  ],
  imports: [
    // forms module
    FormsModule,
    ReactiveFormsModule,
    //
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    // common module
    SharedModule,


    // ConnectModule
    ConnectModule,


    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  entryComponents: [
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
