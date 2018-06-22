import { NgModule } from '@angular/core';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatTooltipModule
} from '@angular/material';
// import {MatFileUploadModule} from 'angular-material-fileupload';

@NgModule({
  exports: [
    //@< angular material
    //loader from angular material
    MatProgressSpinnerModule,
    //date picker angular material
    MatDatepickerModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule, // material checkbox
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatStepperModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatAutocompleteModule,
    // MatFileUploadModule
    //@> angular material
  ],
  imports: [
    //@< angular material
    //loader from angular material
    MatProgressSpinnerModule,
    //date picker angular material
    MatDatepickerModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule, // material checkbox
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatStepperModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatAutocompleteModule,
    // MatFileUploadModule,
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
export class AngularMaterialFormSharedModule { }
