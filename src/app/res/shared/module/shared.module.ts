import { NgModule } from '@angular/core';
import {AngularMaterialFormSharedModule} from '../../../ConnectSystem/res/shared/module/angular-material-form-shared.module';

@NgModule({
  exports: [
    //@< angular material
      AngularMaterialFormSharedModule
    //@> angular material
  ],
  imports: [
    //@< angular material
    AngularMaterialFormSharedModule
    //@> angular material
  ],
  declarations: [
  ],
  entryComponents: [
  ],
  providers: [
    // for view locale date
  ]
})
export class SharedModule { }
