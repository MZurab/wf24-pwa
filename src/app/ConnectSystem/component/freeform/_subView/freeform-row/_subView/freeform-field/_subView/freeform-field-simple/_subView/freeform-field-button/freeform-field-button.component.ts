import {Component, Input, OnInit} from '@angular/core';
import {FreeformCommonService} from '../../../../../../../../../../res/shared/service/freeform/_sub/freeform.common.service';
import {FormControl, FormGroup} from '@angular/forms';
import {FreeformFieldValidatorLibrary} from '../../../../../../../../../../res/shared/service/freeform/_sub/freeform-field-validators.library';

@Component({
  selector: 'wf24-freeform-field-button',
  templateUrl: './freeform-field-button.component.html',
  styleUrls: ['./freeform-field-button.component.scss']
})
export class FreeformFieldButtonComponent implements OnInit {

  // reqired
  @Input('fieldid') fieldid;
  @Input('objid') objid;
  @Input('freeform') freeform;
  @Input('disabled') disabled;

  // this field from freeform object
  field;

  // create angular reactive form
  form = new FormGroup(
    {
      field: new FormControl(
        '',
        []
      )
    }
  );

  type: string;
  color: string;

  constructor(
    // private common: FreeformCommonService
  ) { }

  ngOnInit() {
    this.field  = this.freeform.fields[this.fieldid].objects[this.objid];

    this.color = this.field.body.payload.color || "primary";
    this.type = this.field.body.payload.type || "basic";

    let field = this.field;
    console.log('btn - field.options', field.options);
    console.log('btn - field.body.status', field.body.status);
  console.log('field.body.status.disabled  || !field.options.write', field.body.status.disabled  || !field.options.write, field.body.status.disabled, !field.options.write)
    // add required validator
    new FreeformFieldValidatorLibrary(this.freeform, this.field, this.form).run();
  }

}
