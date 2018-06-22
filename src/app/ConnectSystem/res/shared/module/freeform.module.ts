import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FreeformFieldSlidetoggleComponent} from '../../../component/freeform/_subView/freeform-row/_subView/freeform-field/_subView/freeform-field-simple/_subView/freeform-field-slidetoggle/freeform-field-slidetoggle.component';
import {FreeformFieldAutocompleteComponent} from '../../../component/freeform/_subView/freeform-row/_subView/freeform-field/_subView/freeform-field-simple/_subView/freeform-field-autocomplete/freeform-field-autocomplete.component';
import {FreeformFieldCheckboxComponent} from '../../../component/freeform/_subView/freeform-row/_subView/freeform-field/_subView/freeform-field-simple/_subView/freeform-field-checkbox/freeform-field-checkbox.component';
import {FreeformFieldUploadComponent} from '../../../component/freeform/_subView/freeform-row/_subView/freeform-field/_subView/freeform-field-simple/_subView/freeform-field-upload/freeform-field-upload.component';
import {FreeformFieldComponent} from '../../../component/freeform/_subView/freeform-row/_subView/freeform-field/freeform-field.component';
import {FreeformFieldSimpleComponent} from '../../../component/freeform/_subView/freeform-row/_subView/freeform-field/_subView/freeform-field-simple/freeform-field-simple.component';
import {FreeformFieldSwitcherComponent} from '../../../component/freeform/_subView/freeform-row/_subView/freeform-field/_subView/freeform-field-simple/_subView/freeform-field-switcher/freeform-field-switcher.component';
import {FreeformFieldTextComponent} from '../../../component/freeform/_subView/freeform-row/_subView/freeform-field/_subView/freeform-field-simple/_subView/freeform-field-text/freeform-field-text.component';
import {FreeformFieldButtonComponent} from '../../../component/freeform/_subView/freeform-row/_subView/freeform-field/_subView/freeform-field-simple/_subView/freeform-field-button/freeform-field-button.component';
import {FreeformFieldRadioComponent} from '../../../component/freeform/_subView/freeform-row/_subView/freeform-field/_subView/freeform-field-simple/_subView/freeform-field-radio/freeform-field-radio.component';
import {FreeformComponent} from '../../../component/freeform/freeform.component';
import {FreeformObjectDirective} from '../service/freeform/directive/freeform-object.directive';
import {FreeformFieldDateComponent} from '../../../component/freeform/_subView/freeform-row/_subView/freeform-field/_subView/freeform-field-simple/_subView/freeform-field-date/freeform-field-date.component';
import {FreeformPageComponent} from '../../../component/freeform/_subView/freeform-page/freeform-page.component';
import {FreeformRowComponent} from '../../../component/freeform/_subView/freeform-row/freeform-row.component';
import {FreeformFieldSelectComponent} from '../../../component/freeform/_subView/freeform-row/_subView/freeform-field/_subView/freeform-field-simple/_subView/freeform-field-select/freeform-field-select.component';
import {FreeformGroupComponent} from '../../../component/freeform/_subView/freeform-group/freeform-group.component';
import {FreeformFieldTextareaComponent} from '../../../component/freeform/_subView/freeform-row/_subView/freeform-field/_subView/freeform-field-simple/_subView/freeform-field-textarea/freeform-field-textarea.component';
import {FreeformFieldCollectionComponent} from '../../../component/freeform/_subView/freeform-row/_subView/freeform-field/_subView/freeform-field-collection/freeform-field-collection.component';
import {FreeformFieldTextredactorComponent} from '../../../component/freeform/_subView/freeform-row/_subView/freeform-field/_subView/freeform-field-simple/_subView/freeform-field-textredactor/freeform-field-textredactor.component';

import {FreeformService} from '../service/freeform/freeform.service';
import {FreeformPageService} from '../service/freeform/_sub/freeform.page.service';
import {FreeformCommonService} from '../service/freeform/_sub/freeform.common.service';
import {FreeformRowService} from '../service/freeform/_sub/freeform.row.service';
import {FreeformAutocompleteService} from '../service/freeform/freeform-autocomplete.service';
import {FreeformGroupService} from '../service/freeform/_sub/freeform.group.service';
import {FreeformFieldService} from '../service/freeform/_sub/freeform.field.service';
// import {SharedModule} from '../../../../res/shared/module/shared.module';
import {ConnectSharedModule} from './connect-shared.module';
import {AngularMaterialFormSharedModule} from './angular-material-form-shared.module';
import {FreeformTriggerService} from '../service/freeform/_sub/triggers/freeform-trigger.service';
import {FreeformValueService} from '../service/freeform/_sub/freeform-value.service';

//3d party
// import {CKEditorModule} from 'ng2-ckeditor';
// import {UcWidgetComponent} from 'ngx-uploadcare-widget';
import {FreeformViewImageComponent} from '../../../component/freeform/_subView/freeform-row/_subView/freeform-field/_subView/freeform-field-simple/_subView/freeform-view-image/freeform-view-image.component';
import {ConnectDropDirective} from '../service/connect/directive/connect-drop-directive';
import {ConnectGstorageService} from '../service/user/connect-gstorage.service';
// import {DragAndDropModule} from 'angular-draggable-droppable';
// import {DndModule} from 'ng2-dnd';

@NgModule({
  exports: [
    // connect dixtionary pipe && mask
    ConnectSharedModule,

    // CKEditorModule,

    //  freeform
    FreeformComponent,
    FreeformPageComponent,
    FreeformGroupComponent,
    FreeformRowComponent,

    // freeform -> fields -> simple
    FreeformFieldComponent,
    FreeformFieldSimpleComponent,
    FreeformFieldTextComponent,
    FreeformFieldSelectComponent,
    FreeformFieldCheckboxComponent,
    FreeformFieldSwitcherComponent,
    FreeformFieldDateComponent,
    FreeformFieldButtonComponent,
    FreeformFieldRadioComponent,
    FreeformFieldUploadComponent,
    FreeformFieldSlidetoggleComponent,
    FreeformFieldCollectionComponent,
    FreeformFieldTextareaComponent,
    FreeformFieldAutocompleteComponent,
    FreeformFieldTextredactorComponent,
    FreeformViewImageComponent,

    //upload care
    // UcWidgetComponent,
    // UcWidgetModule,

    // freeform object directives
    FreeformObjectDirective,

    // drag and drope module
    // DragAndDropModule
    // ConnectDropDirective

  ],
  imports: [
    CommonModule,
    // angular material shared module
    AngularMaterialFormSharedModule,
    // shared module with mask
    ConnectSharedModule,
    // CKEditorModule,

    // UcWidgetModule,

    // drag and drope module
    // DragAndDropModule.forRoot()

  ],
  declarations: [
    //  freeform
    FreeformComponent,
    FreeformPageComponent,
    FreeformGroupComponent,
    FreeformRowComponent,

    // freeform -> fields -> simple
    FreeformFieldComponent,
    FreeformFieldSimpleComponent,
    FreeformFieldTextComponent,
    FreeformFieldSelectComponent,
    FreeformFieldCheckboxComponent,
    FreeformFieldSwitcherComponent,
    FreeformFieldDateComponent,
    FreeformFieldButtonComponent,
    FreeformFieldRadioComponent,
    FreeformFieldUploadComponent,
    FreeformFieldSlidetoggleComponent,
    FreeformFieldCollectionComponent,
    FreeformFieldTextareaComponent,
    FreeformFieldAutocompleteComponent,
    FreeformFieldTextredactorComponent,


    //upload care
    // UcWidgetComponent,
    FreeformViewImageComponent,

    // freeform object directives
    FreeformObjectDirective,

    ConnectDropDirective

  ],
  entryComponents: [
  ],
  providers: [
    FreeformCommonService,
    FreeformFieldService,
    FreeformRowService,
    FreeformGroupService,
    FreeformPageService,
    FreeformService,
    FreeformAutocompleteService,
    FreeformTriggerService,
    FreeformValueService,
    ConnectGstorageService
  ]
})
export class FreeformModule { }
