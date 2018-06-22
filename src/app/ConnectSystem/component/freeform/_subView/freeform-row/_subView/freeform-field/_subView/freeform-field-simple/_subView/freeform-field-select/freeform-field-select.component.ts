import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FreeformCommonService} from '../../../../../../../../../../res/shared/service/freeform/_sub/freeform.common.service';
import {FreeformFieldValidatorLibrary} from '../../../../../../../../../../res/shared/service/freeform/_sub/freeform-field-validators.library';

@Component({
  selector: 'wf24-freeform-field-select',
  templateUrl: './freeform-field-select.component.html',
  styleUrls: ['./freeform-field-select.component.scss']
})
export class FreeformFieldSelectComponent implements OnInit {

  // reqired
  @Input('fieldid')     fieldid;
  @Input('objid')       objid;
  @Input('freeform')    freeform;
  @Input('disabled')    disabled;


  //optional
  @Input('multi') multi: boolean;

  // this field from freeform object
  field;


  // here we add error text
  textOfError: string = '';

  // create angular reactive form
  form = new FormGroup(
    {
      field: new FormControl(
        '',
        []
      )
    }
  );

  constructor(
    private common: FreeformCommonService
  ) { }

  ngOnInit() {
    this.field  = this.freeform.fields[this.fieldid].objects[this.objid];

    // add required validator
    new FreeformFieldValidatorLibrary(this.freeform, this.field, this.form).run();
  }






}
