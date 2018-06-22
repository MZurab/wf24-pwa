import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {FreeformFieldValidatorLibrary} from '../../../../../../../../../../res/shared/service/freeform/_sub/freeform-field-validators.library';
import {FreeformCommonService} from '../../../../../../../../../../res/shared/service/freeform/_sub/freeform.common.service';

window['UPLOADCARE_LOCALE'] = 'ru'; // set a preferred locale if needed

@Component({
  selector: 'wf24-freeform-field-textredactor',
  templateUrl: './freeform-field-textredactor.component.html',
  styleUrls: ['./freeform-field-textredactor.component.scss']
})
export class FreeformFieldTextredactorComponent implements OnInit {

  // CKEDITOR = window['CKEDITOR'];

  ckeditorConfig = {
    // uiColor       : '#99000',
    extraPlugins  : 'uploadcare',
    uploadcare: {
      publicKey: '75cdcf4baad946c1a02c', // set your public API key here
      multiple: true, // allow multi-file uploads
      locale: 'ru'
      // crop: '1:1,4:3', // set crop options when handling images
      /* feel free to add more “object key” options here */
    }
  };


// reqired
  @Input('fieldid')     fieldid;
  @Input('objid')       objid;
  @Input('freeform')    freeform;
  @Input('disabled')    disabled;

  // optional
  @Input('type')        type = 'text';


  // this field from freeform object
  field;
  // this field we add mask
  mask;



  // create angular reactive form
  form = new FormGroup(
    {
      field: new FormControl(
        ''
      )
    }
  );

  constructor(
    private common: FreeformCommonService
  ) { }

  ngOnInit() {
    this.field  = this.freeform.fields[this.fieldid].objects[this.objid];
    this.type   = this.field.type || this.type;

    // add required validator
    new FreeformFieldValidatorLibrary(this.freeform, this.field, this.form).run();
  }

  change (iNvalue) {
    this.common.for_dependentStartByObject(this.field);
  }

  onKeyPress (iNevent) {
    let event = iNevent,
      symbol = event.key,
      keyCode = event.keyCode;

    // dont block this symbols (enter or backspace or delete () and so on...)
    if (
      keyCode === 8 || // enter
      keyCode === 9 || // tab
      keyCode === 13 || //backspase
      keyCode === 110 || // delete
      keyCode === 39 || // >
      keyCode === 37 // <
    ) return true;
    //**LATER add key up work only for need fields
    if (
      this.field.body.rules.resolvedSymbols &&
      Array.isArray(this.field.body.rules.resolvedSymbols)
    ) {
      let result = this.common.checkSymbolForResolved(symbol,this.field.body.rules.resolvedSymbols);
      if (!result) {
        //dellete last symbol if this symbola not resolved
        // this.field.body['value'] = this.field.body.value.slice(0, -1);
        console.log('onKeyPress - false');
        return true;
      }

    } else {
      return true;

    }
    return false;


  }

  onContentDom (data) {
    console.log('onContentDom', data);
  }
  onFileUploadRequest (data) {
    console.log('onFileUploadRequest', data);
  }
  onFocus (data) {
    console.log('onFocus', data);
  }
  onReady (data) {
    console.log('onReady', data);
  }
  onEditorChange (data) {
    console.log('onEditorChange', data);
  }
  onChange (data) {
    console.log('onChange', data);
  }
  onBlur (data) {
    console.log('onBlur', data);
  }
}
