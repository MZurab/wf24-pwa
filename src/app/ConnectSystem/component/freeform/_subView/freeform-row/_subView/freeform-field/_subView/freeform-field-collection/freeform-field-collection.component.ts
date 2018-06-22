import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'wf24-freeform-field-collection',
  templateUrl: './freeform-field-collection.component.html',
  styleUrls: ['./freeform-field-collection.component.scss']
})
export class FreeformFieldCollectionComponent implements OnInit {

  @Input('fieldid')   fieldid;
  @Input('objid')     objid;
  @Input('freeform')  freeform;
  @Input('disabled')  disabled;
  // here we add collection in init
  collection;

  constructor() { }

  ngOnInit() {
    this.collection = this.freeform['fields'][this.fieldid]['objects'][this.objid];
  }

}
