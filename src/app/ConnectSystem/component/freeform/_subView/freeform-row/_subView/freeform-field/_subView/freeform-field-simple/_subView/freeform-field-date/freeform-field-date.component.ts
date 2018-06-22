import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {FreeformCommonService} from '../../../../../../../../../../res/shared/service/freeform/_sub/freeform.common.service';
import {FreeformFieldValidatorLibrary} from '../../../../../../../../../../res/shared/service/freeform/_sub/freeform-field-validators.library';

// import * as moment from 'moment';
import {FreeformValueService} from '../../../../../../../../../../res/shared/service/freeform/_sub/freeform-value.service';
import {MatDatepickerInputEvent} from '@angular/material';

@Component({
  selector: 'wf24-freeform-field-date',
  templateUrl: './freeform-field-date.component.html',
  styleUrls: ['./freeform-field-date.component.scss']
})
export class FreeformFieldDateComponent implements OnInit {

  // reqired
  @Input('fieldid')     fieldid;
  @Input('objid')       objid;
  @Input('freeform')    freeform;
  @Input('disabled')    disabled;



  // this field from freeform object
  field;

  // create angular reactive form
  form = new FormGroup(
    {
      field: new FormControl('')
    }
  );

  //date
  date;

  constructor(
    private common: FreeformCommonService,
    private valueService: FreeformValueService
  ) { }

  ngOnInit() {
    this.field  = this.freeform.fields[this.fieldid].objects[this.objid];

    // add required validator
    new FreeformFieldValidatorLibrary(this.freeform, this.field, this.form).run();

    //
    this.date = (this.field.body.value) ? new Date( parseInt(this.field.body.value) ) : null;

  }


  onKeyPress (iNevent) {
    // let event = iNevent,
    //   symbol = event.key,
    //   keyCode = event.keyCode;
    // console.log('onKeyPress - iNevent' ,symbol, keyCode, iNevent );
    // // dont block this symbols (enter or backspace or delete () and so on...)
    // if (
    //   keyCode === 8 || // enter
    //   keyCode === 9 || // tab
    //   keyCode === 13 || //backspase
    //   keyCode === 110 || // delete
    //   keyCode === 39 || // >
    //   keyCode === 37 // <
    // ) return true;
    // //**LATER add key up work only for need fields
    // if (
    //   this.field.body.rules.resolvedSymbols &&
    //   Array.isArray(this.field.body.rules.resolvedSymbols)
    // ) {
    //   let result = this.common.checkSymbolForResolved(symbol, this.field.body.rules.resolvedSymbols);
    //   if (!result) {
    //     //dellete last symbol if this symbola not resolved
    //     // this.field.body['value'] = this.field.body.value.slice(0, -1);
    //     console.log('onKeyPress - false');
    //     return true;
    //   }
    //
    // } else {
    //   return true;
    //
    // }
    // console.log('onKeyPress - true');
    // return false;
  }

  onChange () {
    // console.log('change - this.date 1 ', typeof  this.date, this.date);
    // if (typeof  this.date === 'object') {
    //   this.field.body.value = this.date.toDate().getTime();
    //   console.log('change - this.date 2 ', this.date.toDate().getTime());
    // }
    // moment()
  }

  dateChange (momentDate) { // : MatDatepickerInputEvent<Date>
    // console.log('dateChange - momentDate ', momentDate.value.toDate().getTime(), momentDate);
    this.valueService.setFieldValue(this.field, momentDate['value'].toDate().getTime(), [], false)
  }

  dateInput (ed: MatDatepickerInputEvent<Date>) {
    // console.log('dateInput - ed ', ed);
    // this.valueService.setFieldValue(this.field, this.this_object.body.value, [], false)
  }

}
