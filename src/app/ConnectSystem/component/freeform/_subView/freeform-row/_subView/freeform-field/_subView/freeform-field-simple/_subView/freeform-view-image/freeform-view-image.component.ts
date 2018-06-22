import {Component, Input, OnInit} from '@angular/core';
import {FreeformCommonService} from '../../../../../../../../../../res/shared/service/freeform/_sub/freeform.common.service';
import {FreeformFieldUploadComponent} from '../freeform-field-upload/freeform-field-upload.component';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'wf24-freeform-view-image',
  templateUrl: './freeform-view-image.component.html',
  styleUrls: ['./freeform-view-image.component.scss']
})
export class FreeformViewImageComponent implements OnInit {

  // reqired
  @Input('fieldid')   fieldid;
  @Input('objid')     objid;
  @Input('freeform')  freeform;
  @Input('disabled')  disabled;

  //optional
  // @Input('multi') multi: boolean;

  // this field from freeform object
  field;

  // create angular reactive form
  // form = new FormGroup(
  //   {
  //     field: new FormControl('')
  //   }
  // );

  constructor(
    private common: FreeformCommonService
  ) {
  }

  ngOnInit() {
    this.field = this.freeform.fields[this.fieldid].objects[this.objid];
    // set for view block not required
    this.field.body.status.required = [];
  }


}
