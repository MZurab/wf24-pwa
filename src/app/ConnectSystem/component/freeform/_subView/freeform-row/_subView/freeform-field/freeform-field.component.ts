import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'wf24-freeform-field',
  templateUrl: './freeform-field.component.html',
  styleUrls: ['./freeform-field.component.scss']
})
export class FreeformFieldComponent implements OnInit {
  @Input('rowid')     rowid;
  @Input('objid')     objid;
  @Input('freeform')  freeform;
  @Input('disabled')  disabled;

  // here we add fields from row
  fields;

  constructor(/*private renderer: Renderer2*/) { }

  ngOnInit(): void {
    this.fields = this.freeform.rows[this.rowid].objects[this.objid].body.fields;


    // if we have not field yet (open ready form from db) -> we created fields
  }

  // async getFieldsFromRow () {
  //
  //   if (typeof this.freeform.fields !== 'object') this.freeform.fields ={};
  //
  //   let freeformFields = this.freeform.fields;
  //
  //   for () {
  //
  //   }
  // }


}
