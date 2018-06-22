import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'wf24-freeform-row',
  templateUrl: './freeform-row.component.html',
  styleUrls: ['./freeform-row.component.scss']
})
export class FreeformRowComponent implements OnInit {

  @Input('groupid') groupid;
  @Input('objid') objid;
  @Input('freeform') freeform;
  @Input('disabled') disabled;


  constructor() { }

  ngOnInit() {
  }

  public setThisRowStateToFocus (iNid) {
    console.log('setThisRowStateToFocus INVOKE - iNid',iNid);
    if(typeof this.freeform['focused'] !== 'object') this.freeform['focused'] = {};
    this.freeform['focused']['row'] = iNid;
  }

}
