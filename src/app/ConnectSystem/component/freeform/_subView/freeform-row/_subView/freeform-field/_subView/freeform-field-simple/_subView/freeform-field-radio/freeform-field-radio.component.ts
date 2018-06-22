import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'wf24-freeform-field-radio',
  templateUrl: './freeform-field-radio.component.html',
  styleUrls: ['./freeform-field-radio.component.scss']
})
export class FreeformFieldRadioComponent implements OnInit {


  // reqired
  @Input('fieldid') fieldid;
  @Input('objid') objid;
  @Input('freeform') freeform;
  @Input('disabled')    disabled;


  // this field from freeform object
  field;

  // create angular reactive form
  form = new FormGroup(
    {
      field: new FormControl('')
    }
  );


  constructor() {
  }

  ngOnInit() {
    this.field = this.freeform.fields[this.fieldid].objects[this.objid];

    // add angular form to freefrom object
    this.field['angular'] = { 'form': this.form };
  }

}
