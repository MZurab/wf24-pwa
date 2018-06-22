import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

import {Observable} from 'rxjs';
import {startWith, map} from 'rxjs/operators';
import {FreeformAutocompleteService} from '../../../../../../../../../../res/shared/service/freeform/freeform-autocomplete.service';
import {FreeformCommonService} from '../../../../../../../../../../res/shared/service/freeform/_sub/freeform.common.service';
import {FreeformFieldValidatorLibrary} from '../../../../../../../../../../res/shared/service/freeform/_sub/freeform-field-validators.library';
import {FreeformTriggerService} from '../../../../../../../../../../res/shared/service/freeform/_sub/triggers/freeform-trigger.service';
import {FreeformValueService} from '../../../../../../../../../../res/shared/service/freeform/_sub/freeform-value.service';

@Component({
  selector: 'wf24-freeform-field-autocomplete',
  templateUrl: './freeform-field-autocomplete.component.html',
  styleUrls: ['./freeform-field-autocomplete.component.scss']
})
export class FreeformFieldAutocompleteComponent implements OnInit {


  // required
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

  // filtered options
  filteredOptions: Observable<any[]>;

  // we add all options from field
  options;

  // we add later options
  arrayForAccessToIndexByValue = {};

  // create angular reactive form
  form = new FormGroup (
    {
      field: new FormControl(
        ''
      )
    }
  );


  constructor(
    private common: FreeformCommonService,
    private autocmplete: FreeformAutocompleteService,
    private valueService: FreeformValueService
  ) {
  }


  filter (iNfield) {
    return this.autocmplete.filter(iNfield, this.options);
  }

  ngOnInit() {
    this.field    = this.freeform.fields[this.fieldid].objects[this.objid];
    this.type     = this.field.type || this.type;
    this.options  = this.field.body.payload.options;

    // add autocomplete array
    this.changeAutocompleteArr();

    // add required validator
    new FreeformFieldValidatorLibrary(this.freeform, this.field, this.form).run();
  }


  changeAutocompleteArr () {
    this.filteredOptions = this.form.valueChanges
      .pipe(
        startWith(''),
        map (option => option ? this.filter(option) : this.options.slice() )
      );
  }

  onSelect(iNvalue) {
    let val             = iNvalue,
        index           = this.arrayForAccessToIndexByValue[iNvalue],
        selectedObject  = this.options[index];

    // set clicked value to this
    this.field.body.value = val;

    // save selected object (would need for late access)
    this.autocmplete.saveAutocompleteSelectedToFreeformObject(this.field, selectedObject);



    // run onChange trigger if need
    this.valueService.setFieldValue(this.field, val,['onSelect'], false);
    // this.valueService.trigger.runLater(this.field, ['onSelect']);

  }

  run () {
    this.autocmplete.runWithTimeout (
      (iNresultArray, iNindexArray) => {
        // save index array
        this.arrayForAccessToIndexByValue = iNindexArray;
        // save new val
        this.options = this.field.body.payload.options = iNresultArray;
        // change autocompleter array
        this.changeAutocompleteArr();
      },
      this.field,
      this.freeform
    );
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
    ) {
      // run autocomplete service
      this.run();

      return true;
    }
    //**LATER add key up work only for need fields
    if (
      this.field.body.rules.resolvedSymbols &&
      Array.isArray(this.field.body.rules.resolvedSymbols)
    ) {
      let result = this.common.checkSymbolForResolved( symbol, this.field.body.rules.resolvedSymbols);
      if (!result) {
        // run autocomplete service
        this.run();

        return true;
      }

    } else if(
      !Array.isArray(this.field.body.rules.resolvedSymbols)
    ){
      // run autocomplete service
      this.run();
      //
      return true;

    }

    return false;


  }
}
