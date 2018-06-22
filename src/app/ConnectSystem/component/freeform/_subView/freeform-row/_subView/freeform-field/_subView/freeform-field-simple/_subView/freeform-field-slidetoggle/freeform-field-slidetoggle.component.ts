import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FreeformCommonService} from '../../../../../../../../../../res/shared/service/freeform/_sub/freeform.common.service';

@Component({
  selector: 'wf24-freeform-field-slidetoggle',
  templateUrl: './freeform-field-slidetoggle.component.html',
  styleUrls: ['./freeform-field-slidetoggle.component.scss']
})
export class FreeformFieldSlidetoggleComponent implements OnInit {
  // reqired
  @Input('fieldid') fieldid;
  @Input('objid') objid;
  @Input('freeform') freeform;
  @Input('disabled') disabled;


  //optional
  @Input('multi') multi: boolean;

  // this field from freeform object
  field;

  // create angular reactive form
  form = new FormGroup(
    {
      field: new FormControl(
        '',
        [Validators.required]
      )
    }
  );

  constructor(private common: FreeformCommonService) {
  }

  ngOnInit() {
    this.field = this.freeform.fields[this.fieldid].objects[this.objid];
  }
}

