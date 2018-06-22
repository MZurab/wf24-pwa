import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {FreeformCommonService} from '../../../../../../../../../../res/shared/service/freeform/_sub/freeform.common.service';

@Component({
  selector: 'wf24-freeform-field-checkbox',
  templateUrl: './freeform-field-checkbox.component.html',
  styleUrls: ['./freeform-field-checkbox.component.scss']
})
export class FreeformFieldCheckboxComponent implements OnInit {

  // reqired
  @Input('fieldid') fieldid;
  @Input('objid')     objid;
  @Input('freeform') freeform;
  @Input('disabled') disabled;


  // this field from freeform object
  field;

  // create angular reactive form
  form = new FormGroup(
    {
      field: new FormControl('')
    }
  );

  constructor(
    private common: FreeformCommonService

  ) {
  }


  for_ (iNfield) {
    if ( Array.isArray( iNfield['body']['rule']['for'] ) ) {
      for ( let el of iNfield['body']['rule']['for'] ) {
        let result = this.compare(el, iNfield[ el['id'] ] );
        if ( !result ) {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  compare (iNrule, iNfield) {
    /*
      @input
        iNrule
          @required
            value
            id
          @optional
            mark - enumb (==,!=,>,<,in, active)
    */
    const rule = iNrule;
    const fieldValue = iNfield['body']['value'];

    let r = false;
    switch (rule.mark) {
      case '!=':
        if (rule['value'] !== fieldValue) { r = true; }
      break;

      case '>':
        if (rule['value'] > fieldValue) { r = true; }
      break;

      case '<':
        if (rule['value'] < fieldValue) { r = true; }
      break;

      case 'active':
        if ( iNfield['body']['status']['value'] === 1 ) { r = true; }
      break;

      case 'in':
        if (Array.isArray(fieldValue) && fieldValue.indexOf(rule['value']) !== -1) { r = true; }
      break;

      default: // ==
        if (rule['value'] === fieldValue) { r = true; }
      break;
    }

    return r;
  }




  ngOnInit() {
    this.field = this.freeform.fields[this.fieldid].objects[this.objid];

    // add angular form to freefrom object
    this.field['angular'] = { 'form': this.form };
  }

  updateValue (iNcheckbox) {
    const value     = iNcheckbox['name'];
    const checked   = iNcheckbox['checked'];
    // check array
    this.check();

    if ( checked ) {
      // add to array
      this.addValue(value);

    } else {
      // del from array
      this.delValue(value);
    }
    // change status
    this.updateStatus();
  }

  updateStatus () {
    if (this.field.body.value.length > 0 ) {
      this.field.body.status.value = 1;
    } else {
      this.field.body.status.value = 0;
    }
  }

  check () {
    //
    if ( !Array.isArray(this.field['body']['value']) ) { this.field['body']['value'] = []; }

  }

  addValue (iNval) {

    let arr = this.field['body']['value'];
    let added = false;
    for (let val of arr) {
      if (val === iNval) {added = true; }
    }
    if (!added ) {
      arr.push(iNval);
    }

  }

  delValue (iNval) {
    let arr = this.field['body']['value'];

    for (let k in arr) {
      if (arr[k] === iNval) {
        // this.field['body']['value'] = arr.slice(k, 1);
        arr.splice(k, 1);
        break;
      }
    }
  }


  change (iNvalue, iNobj) {
    console.log('change - iNel, iNobj', iNvalue, iNobj );
    this.common.for_dependentStartByObject(this.field);

  }
}


