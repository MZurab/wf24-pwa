import {FreeformCommonLibrary} from './freeform-common.library';

export class FreeformFieldStateLibrary  {
  //
  freeform;

  //

  // freeform common library
  freeformCommon = new FreeformCommonLibrary();

  constructor (
  ) {
  }

  //@< CHECKING
  private  updateStatusForObjectForRequiredStatus ( iNvalue: boolean, iNmemory: object, iNarray: Array<string> ): boolean {
    let checker = false;
    // обходим массив
    for ( let inRequiredId of iNarray ) {
      if  ( iNmemory[inRequiredId] === false || iNvalue ===  iNmemory[inRequiredId] ) {
        // if the status already false OR we have the same state -> stop iterate
        continue;
      }
      // if we have not value set new status
      iNmemory[inRequiredId] = iNvalue;
      // save that we did changes
      checker = true;
    }
    return checker;
  }

  private checkForIssetTrueElOfObject ( iNmemory: object ) {
    console.log('checkForIssetTrueElOfObject - iNmemory', iNmemory);
    if ( Object.keys(iNmemory).length === 0 ) { return true; }

    for (let key of Object.keys(iNmemory) ) { // Array.isArray()
      if ( iNmemory[key] === true) {
        // if we have even one true element
        return true;
      }
    }
    return false;
  }
  // updating field of status
  private updateFieldStatus (iNid, iNmodelId, iNinnerMemory: object ) {
    let obj               = this.freeform['fields'][iNmodelId]['objects'][iNid],
        pre               = obj.pre,
        post              = obj.post,
        requiredGroups    = obj['body']['status']['required'],
        innerChildMemory  = obj['body']['gen']['required'] = {};

    for (let field of pre ) {
      let r = this.updateFieldStatus(field.objid, field.baseid, iNinnerMemory);
    }

    for (let field of post ) {
      let r = this.updateFieldStatus(field.objid, field.baseid, iNinnerMemory);
    }

    let result;

    if ( obj['body']['type'] === 'collection' ) {

      this.updateCollectionStatus (iNid, iNmodelId, innerChildMemory );

      // get status this collection => update status of this object
      result =  obj['body']['status']['value'] = this.checkForIssetTrueElOfObject ( innerChildMemory );

    } else {
      // get status this field
      result = obj['body']['status']['value'];
      //obj['body']['status']['value'] = (obj['body']['value']) ? true : false);
    }

    // set right status for parent object
    this.updateStatusForObjectForRequiredStatus ( result, iNinnerMemory, requiredGroups);

    return result;
  }

  private updateCollectionStatus (iNid, iNmodelId, iNinnerMemory: object ) {
    let obj             = this.freeform['fields'][iNmodelId]['objects'][iNid],
      pre               = obj.pre,
      post              = obj.post,
      requiredGroups    = obj['body']['status']['required'],
      innerChildMemory  = obj['body']['gen']['required'] = {};

    for (let field of pre ) {
      let r = this.updateCollectionStatus(field.objid, field.baseid, iNinnerMemory);
    }

    for (let field of post ) {
      let r = this.updateCollectionStatus(field.objid, field.baseid, iNinnerMemory);
    }

    // invoke this element
    for (let field of obj['body']['fields']) {
      let r = this.updateFieldStatus(field.objid, field.baseid, innerChildMemory);
    }
    // get status => update status of this object
    let result =  obj['body']['status']['value'] = this.checkForIssetTrueElOfObject (innerChildMemory);

    // set right status for parent object
    this.updateStatusForObjectForRequiredStatus ( result, iNinnerMemory, requiredGroups);

    return result;
  }

  private updateRowStatus ( iNid, iNmodelId, iNinnerMemory: object ) {
    let obj               = this.freeform['rows'][iNmodelId]['objects'][iNid],
        pre               = obj.pre,
        post              = obj.post,
        requiredGroups    = obj['body']['status']['required'],
        innerChildMemory  = obj['body']['gen']['required']    = {};

    for (let field of pre ) {
      let r = this.updateRowStatus(field.objid, field.baseid, iNinnerMemory);
    }

    for (let field of post ) {
      let r = this.updateRowStatus(field.objid, field.baseid, iNinnerMemory);
    }

    // invoke this element
    for (let field of obj['body']['fields']) {
      let r = this.updateFieldStatus(field.objid, field.baseid, innerChildMemory);
    }

    // get status => update status of this object
    let result =  obj['body']['status']['value'] = this.checkForIssetTrueElOfObject (innerChildMemory);

    // set right status for parent object
    this.updateStatusForObjectForRequiredStatus ( result, iNinnerMemory, requiredGroups);

    return result;
  }

  private updateGroupStatus (iNid, iNmodelId, iNinnerMemory: object ) {
    let obj               = this.freeform['groups'][iNmodelId]['objects'][iNid],
        pre               = obj.pre,
        post              = obj.post,
        requiredGroups    = obj['body']['status']['required'],
        innerChildMemory  = obj['body']['gen']['required'] = {};

    for (let group of pre ) {
      let r = this.updateGroupStatus(group.objid, group.baseid, iNinnerMemory);
    }

    for (let group of post ) {
      let r = this.updateGroupStatus(group.objid, group.baseid, iNinnerMemory);
    }

    // invoke this element
    for (let row of obj['body']['rows']) {
      let r = this.updateRowStatus(row.objid, row.baseid, innerChildMemory);
    }

    // get status => update status of this object
    let result =  obj['body']['status']['value'] = this.checkForIssetTrueElOfObject (innerChildMemory);

    // set right status for parent object
    this.updateStatusForObjectForRequiredStatus ( result, iNinnerMemory, requiredGroups);

    return result;
  }

  private updatePageStatus (iNid, iNmodelId, iNinnerMemory: object ) {

    let obj               = this.freeform['pages'][iNmodelId]['objects'][iNid],
        pre               = obj.pre,
        post              = obj.post,
        requiredGroups    = obj['body']['status']['required'],
        innerChildMemory  = obj['body']['gen']['required'] = {};

    for (let page of pre ) {
      let r = this.updatePageStatus(page.objid, page.baseid, iNinnerMemory);
    }

    for (let page of post ) {
      let r = this.updatePageStatus(page.objid, page.baseid, iNinnerMemory);
    }

    // invoke this element
    for (let row of obj['body']['groups']) {
      let r = this.updateGroupStatus(row.objid, row.baseid, innerChildMemory);
    }

    // get status => update status of this object
    let result =  obj['body']['status']['value'] = this.checkForIssetTrueElOfObject (innerChildMemory);

    // set right status for parent object
    this.updateStatusForObjectForRequiredStatus ( result, iNinnerMemory, requiredGroups);

    return result;
  }
  //@> CHECKING


  // global timee timeout block
  static timeIntervalIdForFieldStatus = {};

  public setFieldStatusLater ( iNid, iNmodelId, iNnewStatus: boolean , iNfreeform, iNcallback ) {
    let timer     = 50,
        callback  = iNcallback;
    // stop last dont finish functions
    clearTimeout( FreeformFieldStateLibrary.timeIntervalIdForFieldStatus[iNid] );
    // run new timer
    FreeformFieldStateLibrary.timeIntervalIdForFieldStatus[iNid] = setTimeout (
      () => {
        this.setFieldStatus( iNid, iNmodelId, iNnewStatus , iNfreeform, callback);
      },
      timer
    );
  }

  private setFieldStatus ( iNid, iNmodelId, iNnewStatus: boolean , iNfreeform, iNcallback) {
    console.log('setFieldStatus 1 INVOKE - iNid, iNmodelId, iNnewStatus', iNid, iNmodelId, iNnewStatus);
    this.freeform       = iNfreeform || this.freeform;
    // get fields from
    let obj       = this.freeform['fields'][iNmodelId]['objects'][iNid],
        body      = obj['body'],
        oldStatus = body['status']['value'],
        callback  = iNcallback;

    if ( oldStatus === iNnewStatus ) {
      // if we have not new status -> stop this func
      return false;
    }

    // update status
    console.log('setFieldStatus 2 - body', body, iNnewStatus);
    body['status']['value'] = iNnewStatus;

    // invoke callback function -> can user change server value
    if (typeof callback === 'function') callback('field', iNmodelId, iNid, iNnewStatus);

    // if (
    //   !(
    //     typeof  body['status']['required'] === 'object' &&
    //     Array.isArray( body['status']['required'] )     &&
    //     body['status']['required'].length > 0
    //   )
    // ) {
    //   // if this field not required stop this func
    //   return false;
    // }

    // if we this field required -> we check/update parent element (collection|field)
    let parent    = this.freeformCommon.getParentBlockFromElement(obj),//body.gen.parent,
        parentObj;

    console.log('setFieldStatus 3 - parent', parent);
    if ( parent['type'] === 'collection' ) {
      // if parent is collection
      parentObj = this.freeform['fields'][ parent['mid'] ]['objects'][ parent['id'] ];
    } else {
      // if parent is row
      parentObj = this.freeform['rows'][ parent['mid'] ]['objects'][ parent['id'] ];
    }

    console.log('setFieldStatus 4 - parentObj', parentObj);
    if (
      (
        // typeof parentObj.body.status.required === 'object'       &&
        // Array.isArray( parentObj.body.status.required )          &&
        // parentObj.body.status.required.length > 0                &&
        parentObj.body.status.value !== iNnewStatus
      )
    ) {
      // if we have required element parent with new status
      if (
        parent['type'] === 'collection'
      ) {
        this.setCollectionStatus(parent['id'], parent['mid'], iNnewStatus, callback );

      } else {
        // if this is field => we update parent element
        this.setRowStatus( parent['id'], parent['mid'], iNnewStatus, callback );


      }
    }
  }

  public setCollectionStatus (iNid, iNmodelId, iNchildStatus, iNcallback) {
    // get fields from
    let obj       = this.freeform['fields'][iNmodelId]['objects'][iNid],
        body      = obj['body'],
        oldStatus = body['status']['value'],
        callback  = iNcallback;

    if ( oldStatus === iNchildStatus ) {
      // if we have not new status -> stop this func
      return false;
    }
    // update this colection status and get this status
    let newStatus = this.updateCollectionStatus(iNid, iNmodelId, {});

    // we have new status
    if ( newStatus  === oldStatus) {
      // if we have not new status -> stop this func
      return false;
    }

    // invoke callback function -> can user change server value
    if(typeof callback === 'function') callback('collection', iNmodelId, iNid, newStatus);

    // if we this field required -> we check/update parent element (collection|field)
    let parent    = this.freeformCommon.getParentBlockFromElement(obj), //body.gen.parent,
        parentObj = this.freeform['rows'][ parent['mid'] ]['objects'][ parent['id'] ];

    if (
      (
        // typeof parentObj.body.status.required === 'object'       &&
        // Array.isArray(parentObj.body.status.required)            &&
        // parentObj.body.status.required.length > 0                &&
        parentObj.body.status.value !== newStatus
      )
    ) {
      // if we have required element parent with new status => we update parent element
      this.setRowStatus(parent['id'], parent['mid'], newStatus, callback);
    }
  }


  public setRowStatus (iNid, iNmodelId, iNchildStatus, iNcallback) {
    // get fields from
    let obj       = this.freeform['rows'][iNmodelId]['objects'][iNid],
        body      = obj['body'],
        oldStatus = body['status']['value'],
        callback  = iNcallback;

    console.log('setRowStatus 1 INVOKE - iNid, iNmodelId, iNchildStatus, oldStatus', iNid, iNmodelId, iNchildStatus, oldStatus);

    // we have new status
    if ( oldStatus === iNchildStatus ) {
      // if we have not new status -> stop this func
      return false;
    }

    console.log('setRowStatus 2 - oldStatus', oldStatus);

    // update this colection status
    let newStatus = this.updateRowStatus(iNid, iNmodelId, {});

    console.log('setRowStatus 3 - newStatus', newStatus);
    // we have new status
    if ( newStatus  === oldStatus) {
      // if we have not new status -> stop this func
      return false;
    }

    // invoke callback function -> can user change server value
    if ( typeof callback === 'function' ) callback('row', iNmodelId, iNid, newStatus);

    // if we this field required -> we check/update parent element (collection|field)
    let parent    = this.freeformCommon.getParentBlockFromElement(obj), //body.gen.parent,
        parentObj = this.freeform['groups'][ parent['mid'] ]['objects'][ parent['id'] ];

    console.log('setRowStatus 4 - parent', parent);
    console.log('setRowStatus 4 - parentObj', parentObj);
    if (
      (
        // typeof parentObj.body.status.required === 'object'       &&
        // Array.isArray(parentObj.body.status.required)            &&
        // parentObj.body.status.required.length > 0                &&
        parentObj.body.status.value !== newStatus
      )
    ) {
      // if we have required element parent with new status => we update parent element
      this.setGroupStatus(parent['id'], parent['mid'], newStatus, callback);
    }
  }


  public setGroupStatus (iNid, iNmodelId, iNchildStatus, iNcallback) {
    // get fields from
    let obj     = this.freeform['groups'][iNmodelId]['objects'][iNid],
      body      = obj['body'],
      oldStatus = body['status']['value'],
      callback  = iNcallback;
    console.log('setGroupStatus 1 INVOKE - ', iNid, iNmodelId, iNchildStatus);
    if ( oldStatus === iNchildStatus ) {
      // if we have not new status -> stop this func
      return false;
    }
    console.log('setGroupStatus 2 oldStatus ', oldStatus);
    // update this colection status
    let newStatus = this.updateGroupStatus(iNid, iNmodelId, {})

    console.log('setGroupStatus 3 newStatus ', newStatus, typeof callback);
    // we have new status
    if ( newStatus  === oldStatus) {
      // if we have not new status -> stop this func
      return false;
    }

    // invoke callback function -> can user change server value
    if(typeof callback === 'function') callback('group', iNmodelId, iNid, newStatus);

    // if we this field required -> we check/update parent element (collection|field)
    let parent    = this.freeformCommon.getParentBlockFromElement(obj), //body.gen.parent,
        parentObj = this.freeform['pages'][ parent['mid'] ]['objects'][ parent['id'] ];

    console.log('setGroupStatus 4 parent ', parent);
    console.log('setGroupStatus 4 parentObj ', parentObj);
    if (
      (
        // typeof parentObj.body.status.required === 'object'       &&
        // Array.isArray(parentObj.body.status.required)            &&
        // parentObj.body.status.required.length > 0                &&

        parentObj.body.status.value !== newStatus
        // true //**LATER FIXED PAGE CHECKER
      )
    ) {
      // if we have required element parent with new status => we update parent element
      this.setPageStatus(parent['id'], parent['mid'], newStatus, callback);
    }
  }

  public updateFormStatusByPage (iNfreeform, iNid, iNmodelId, iNstatus, iNcallback) {  //+
    let freeform      = this.freeform = iNfreeform,
        formStatus    = freeform['status'],
        callback      = iNcallback;

    console.log('updateFormStatusByPage 1 ', typeof formStatus, formStatus);
    if ( typeof formStatus === 'undefined') {
      // if we set form status first time
      this.setPageStatus(iNid, iNmodelId, iNstatus, callback, true);
      return true;
    }
    return true;
  }

  public setPageStatus (iNid, iNmodelId, iNchildStatus, iNcallback, iNforseSet = false) {

    // get fields from
    let obj     = this.freeform['pages'][iNmodelId]['objects'][iNid],
      body      = obj['body'],
      oldStatus = body['status']['value'],
      callback  = iNcallback;

    console.log('setPageStatus 1 - iNid, iNmodelId, iNchildStatus, oldStatus', iNid, iNmodelId, iNchildStatus, oldStatus);

    if ( !iNforseSet && oldStatus === iNchildStatus ) {
      // if we have not new status -> stop this func
      return false;
    }


    // update this colection status
    let newStatus = this.updatePageStatus(iNid, iNmodelId, {});
    console.log('setPageStatus 2 - oldStatus, iNchildStatus ', oldStatus, iNchildStatus, newStatus );

    // we have new status
    if ( !iNforseSet && newStatus  === oldStatus) {
      // if we have not new status -> stop this func
      return false;
    }

    console.log('setPageStatus 3 - oldStatus, newStatus ', oldStatus, newStatus );

    // invoke callback function -> can user change server value
    if (typeof callback === 'function') callback('page', iNmodelId, iNid, newStatus);

    // if we this field required -> we check/update parent element (collection|field)
    let thisForm  = this.freeform;

    if (
      (
        typeof thisForm.status !== 'object' ||
        thisForm.status.value !== newStatus
      )
    ) {
      // if we have new status of element
      this.setFormStatus( newStatus, callback );// parent.objid, parent.modelid,
    }
  }

  public setFormStatus (iNstatus: boolean, iNcallback) {

    console.log('setFormStatus 1 - iNstatus', iNstatus);
    // get fields from
    let freeform = this.freeform,
        status   = freeform['status'],
        callback = iNcallback;

    if ( status === iNstatus ) {
      // if we have not new status -> stop this func
      return false;
    }

    // invoke callback function -> can user change server value
    if (typeof callback === 'function') callback('form', null, null, iNstatus);

    // we have new status -> we update status
    freeform['status'] = { 'value' : iNstatus };
  }
}
