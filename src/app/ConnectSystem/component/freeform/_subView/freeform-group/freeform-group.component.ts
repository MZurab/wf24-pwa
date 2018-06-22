import {Component, Input, OnInit} from '@angular/core';
import {FreeformService} from '../../../../res/shared/service/freeform/freeform.service';
import {FreeformGroupService} from '../../../../res/shared/service/freeform/_sub/freeform.group.service';
import {FreeformFieldStateLibrary} from '../../../../res/shared/service/freeform/_sub/freeform-field-state.library';

@Component({
  selector: 'wf24-freeform-group',
  templateUrl: './freeform-group.component.html',
  styleUrls: ['./freeform-group.component.scss']
})
export class FreeformGroupComponent implements OnInit {

  @Input('pageid')    pageid;
  @Input('objid')     objid;
  @Input('freeform')  freeform;
  @Input('disabled')  disabled;

  constructor (
    private freeformService: FreeformService,
    private freeformGroupService: FreeformGroupService
  ) { }

  freeformStateLibrary = new FreeformFieldStateLibrary();

  ngOnInit() {
    // if this is first opened page -> update form status
    this.freeformStateLibrary.updateFormStatusByPage(this.freeform, this.objid, this.pageid,true, null);
  }

  minimazedGroup  = {};

  isMinimaze(iNgroupModelId, iNgroupId) {
    if ( !this.minimazedGroup[iNgroupModelId] ) { this.minimazedGroup[iNgroupModelId] = {}; }
    if ( typeof this.minimazedGroup[iNgroupModelId][iNgroupId] !== 'boolean' ) {
      this.minimazedGroup[iNgroupModelId][iNgroupId] = this.freeform.groups[iNgroupModelId].objects[iNgroupId].body.status.minimize || false;
    }
    return this.minimazedGroup[iNgroupModelId][iNgroupId];
  }

  isMinimazable (iNgroupModelId, iNgroupId) {
    if ( !this.minimazedGroup[iNgroupModelId] ) { this.minimazedGroup[iNgroupModelId] = {}; }
    if ( typeof this.minimazedGroup[iNgroupModelId][iNgroupId] !== 'boolean' ) {
      this.minimazedGroup[iNgroupModelId][iNgroupId] = this.freeform.groups[iNgroupModelId].objects[iNgroupId].body.status.minimize || false;
    }
    return this.minimazedGroup[iNgroupModelId][iNgroupId];
  }

  public minimizeOff(iNgroupObject, iNmodelId) {
    console.log('minimizeOff INVOKE - iNgroupObject', iNgroupObject);
    iNgroupObject['body']['status']['minimize'] = false;
  }
  public minimizeOn(iNgroupObject) {
    console.log('minimizeOn INVOKE - iNgroupObject', iNgroupObject);
    iNgroupObject['body']['status']['minimize'] = true;
  }
  public copyToPost (iNgroupObject, iNthisModelId: string) {
    var copyObject = {
      id: iNthisModelId,
      weight: 1,
      inid: null
    }
    this.freeformGroupService.copyToPost(iNgroupObject, copyObject);
  }
}
