import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import {FreeformModule} from './freeform.module';
import {ConnectAuthService} from '../service/user/connect-auth.service';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import {AngularFireModule} from 'angularfire2';
import {AngularFireAuth} from 'angularfire2/auth';
import {ConnectAuthGuardService} from '../service/user/connect-auth.guard.service';

import {environment} from '../../../../../environments/environment';
import {AngularFireStorageModule} from 'angularfire2/storage';
const firebaseConfig = environment['firebase'];

@NgModule({
  exports: [
    FreeformModule,
    // Angular
    AngularFireModule,
    AngularFirestoreModule,
    AngularFireStorageModule
    // ConnectDropDirective
  ],
  imports: [
    FreeformModule,

    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule
  ],
  declarations: [
    // ConnectDropDirective
    // ConnectDropDirective
  ],
  entryComponents: [
  ],
  providers: [
    ConnectAuthService,
    AngularFireAuth,
    ConnectAuthGuardService
  ]
})
export class ConnectModule { }
