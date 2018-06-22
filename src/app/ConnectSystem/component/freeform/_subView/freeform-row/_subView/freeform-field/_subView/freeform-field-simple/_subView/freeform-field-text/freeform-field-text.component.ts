import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FreeformCommonService} from '../../../../../../../../../../res/shared/service/freeform/_sub/freeform.common.service';

@Component({
  selector: 'wf24-freeform-field-text',
  templateUrl: './freeform-field-text.component.html',
  styleUrls: ['./freeform-field-text.component.scss']
})
export class FreeformFieldTextComponent implements OnInit {
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
    this.mask   = this.common.getMaskByField(this.field);

    // add angular form to freefrom object
    // this.field['angular'] = { 'form': this.form };


    // add required validator
    // new FreeformFieldValidatorLibrary(this.freeform, this.field, this.form).run();
  }

  change (iNvalue) {
    console.log('change - iNel', iNvalue );
    this.common.for_dependentStartByObject(this.field);

  }

  onKeyPress (iNevent) {
    let event = iNevent,
        symbol = event.key,
        keyCode = event.keyCode;
    console.log('onKeyPress - iNevent' ,symbol, keyCode, iNevent );
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
        let result = this.common.checkSymbolForResolved(symbol, this.field.body.rules.resolvedSymbols);
        if (!result) {
          //dellete last symbol if this symbola not resolved
          // this.field.body['value'] = this.field.body.value.slice(0, -1);
          console.log('onKeyPress - false');
          return true;
        }

      } else {
        return true;

      }
    console.log('onKeyPress - true');
    return false;
  }
}
