import {Injectable} from '@angular/core';
import {FreeformCommonService} from './freeform.common.service';
import {FreeformReadyObjectModel} from '../model/freeform.model';
import {FreeformRowService} from './freeform.row.service';

import {FreeformObjectInterface} from './freeform.object.interface';

@Injectable()
export class FreeformGroupService implements FreeformObjectInterface {
  constructor (
    private common: FreeformCommonService,
    private rows: FreeformRowService
  ) {
  }

  check (iNgroup) {
    if (!this.common.freeform.groups[iNgroup['id']].objects) { this.common.freeform.groups[iNgroup['id']].objects = {}; }
  }

  // copyToPost (iNthisObject, iNcopyObject: {id: string, inid: string | null, weight: number}) {
  //   console.log('copyToPost - iNthisObject', iNthisObject );
  //   if (!iNthisObject.body.status.copiable) return;
  //
  //   const newInIdObject = {},
  //         groupObj  =  this.create(iNcopyObject, newInIdObject);
  //   console.log('copyToPost - groupObj', groupObj );
  //
  //   if (!groupObj) {
  //     // we can not create sub group -> STOP this object
  //     return this.common.returnPromiseValue(null);
  //   }
  //   const      objRef    = { baseid  : iNcopyObject['id'], objid   : groupObj['id'] };
  //   console.log('copyToPost - objRef, newInIdObject', objRef, newInIdObject );
  //
  //   // check iner id if isset
  //     objRef['inid'] = this.common.safeGetInId(iNcopyObject['inid'], groupObj['id'], newInIdObject);
  //
  //   // add to array
  //     iNthisObject.post.push( objRef );
  // }

  copyToPost (iNthisObject,  iNshorData, iNcallback = null, iNwithValue: boolean = false) {
    this.common.copy ( iNthisObject, 'post', this, iNshorData, iNcallback, iNwithValue );
  }

  copyToPre (iNthisObject,  iNshorData, iNcallback = null, iNwithValue: boolean = false) {
    this.common.copy ( iNthisObject, 'pre', this, iNshorData, iNcallback, iNwithValue );
  }


  async create (iNelement: object, iNparentForChild = null, iNnewInIdObject = null, iNfullDownloaded = false, iNcallback): Promise<object>  { //FreeformReadyObjectModel
    console.log('group create 1 - iNparentForChild, iNnewInIdObject', iNparentForChild, iNnewInIdObject );
    // increase counter finish recognizer
      this.common.addCounterOperation();

    this.check(iNelement);

    // random key
    const id      = iNelement['key'] = this.common.safeGetInId(iNelement['inid'], this.common.connect.getUuid(), iNnewInIdObject),
          modelid = iNelement['id']

    // if isset this group not create from model
    let modelFromLocal = null,
        objectFromLocal = null,
        objModel = null,
        objObject,
        sorted;

    //@< check for isset model
      if (
        (
          this.common.freeform['groups'] &&
          this.common.freeform['groups'][modelid]
        )
      ) {
        // we have this model
        modelFromLocal = objModel = this.common.freeform['groups'][modelid];
      } else if (!iNfullDownloaded) {
        // we have not this model local -> get from db
        objModel = await this.common.getElementFromFormObject (
          'group',
          'model',
          FreeformCommonService.userId,
          FreeformCommonService.formModelId,
          FreeformCommonService.formId,
          modelid
        );
        if (objModel) {
          this.common.freeform['groups'][modelid] = { 'base' : objModel, objects: {} };
        }
      }

      if (!objModel) {
        // we have not this model yet -> error end
        return this.common.returnPromiseValue(null);
      }
    //@> check for isset model


    //@< check for isset object
      //**LATER добавить зашиту от несушествующих моделей не полей (сейчас нет зашиты на несушествующие модели)
      if (
        (
          this.common.freeform['groups'][modelid]['objects'][id] &&
          this.common.freeform['groups'][modelid]['objects'][id]['fromLocal'] !== false
        )
      )  {
        // we have this field on server -> not create this field
        objectFromLocal = objObject = this.common.freeform['groups'][modelid]['objects'][id];
        console.log('group object is isset', modelid, id);
      } else if (
        !iNfullDownloaded &&
        !this.common.isSimpleForm() &&
        !objObject &&
        this.common.isSavableObject(this.common.freeform['groups'][modelid])
      ) {
        console.log('group object is NOT isset', modelid, id);
        objObject = await this.common.getElementFromFormObject (
          'group',
          'object',
          FreeformCommonService.userId,
          FreeformCommonService.formModelId,
          FreeformCommonService.formId,
          modelid
        );
      }
    //@> check for isset object


    //@< get group object from model OR (if iseet yet) create safe sub freeform objects
      if ( objObject ) {
        // we have this group object already -> create if need sub freeform objects
        objObject = await this.createIfNeedSubFreeformObjects(iNelement, objectFromLocal, iNnewInIdObject, iNfullDownloaded, iNcallback );
        console.log('create group 2.1 - pageObject', objObject);
      } else {
        // wa have not this freeform objec yet -> create from model with create sub objects
        objObject = await this.getObjectFromModel(iNelement, iNparentForChild, iNnewInIdObject, iNfullDownloaded, iNcallback);
      }

      if (!objObject) {
        // if we canot get this freeform object -> stop this func
        console.log('create group 2.21 - STOP THIS FUNCT');
        return this.common.returnPromiseValue(null);
      }
    //@> get group object from model OR (if iseet yet) create safe sub freeform objects

    //pre step create
    sorted = this.common.sortObjectByWeight( this.common.freeform.groups[iNelement['id']].base.pre );
    for ( let preGroupKey  in sorted ) {
      let preGroup          = sorted[preGroupKey];
          preGroup['index'] = preGroupKey;

      let preGroupObject  = await this.create(preGroup, iNparentForChild, iNnewInIdObject, iNfullDownloaded, iNcallback);
      if (!preGroupObject) {
        // we can not create sub group -> STOP this object
        console.log('create group - 2.01 can not create pre - STOP THIS FUNCT');
        return this.common.returnPromiseValue(null);
      }

      let objRef          = { baseid  : preGroup['id'], objid   : preGroupObject['id'] };
      // check iner id if isset
      if ( preGroup['inid'] ) { objRef['inid'] = this.common.safeGetInId (preGroup['inid'], preGroupObject['id'], iNnewInIdObject) ; }
      // add to array
      objObject.pre.push( objRef );
    }

    // post step create
    sorted = this.common.sortObjectByWeight( this.common.freeform.groups[iNelement['id']].base.post );
    for ( let postGroupKey in sorted ) {
      let postGroup           = sorted[postGroupKey];
          postGroup['index']  = postGroupKey;

      let postGroupObject   = await this.create( postGroup, iNparentForChild, iNnewInIdObject, iNfullDownloaded, iNcallback);

      if (!postGroupObject) {
        // we can not create sub group -> STOP this object
        console.log('create group - 2.01 can not create post - STOP THIS FUNCT');
        return this.common.returnPromiseValue(null);
      }

      let objRef            = { baseid  : postGroup['id'], objid   : postGroupObject['id'] };
      // check iner id if isset and not need generate new inid
      if ( postGroup['inid'] ) {
          objRef['inid'] = this.common.safeGetInId (postGroup['inid'], postGroupObject['id'], iNnewInIdObject) ;
      } else {
        objRef['inid'] = id;
      }
      // add to array
      objObject.post.push( objRef );
    }

    // create dependedents for this element
    this.common.scanRulesOfObject(objObject);

    // add object to freeform object with merge old object
    let obj = this.common.freeform.groups[iNelement['id']].objects[id];
    if ( typeof obj !== 'object' ) { obj = {}; }
    this.common.freeform.groups[ modelid ].objects[id] = Object.assign( objObject, obj );


    let resultGroup = true;
    //@< create in db -> add to server
      if (
        !objectFromLocal ||
        objectFromLocal['fromLocal']
      ) {
        //**LATER or CHANGE delete if we will not need client firestore generating
        // if we generated this object on client
        console.log('group generating', modelid, id, objectFromLocal, objObject);
        // delete local value before server sign
        delete this.common.freeform['groups'][modelid]['objects'][id]['fromLocal'];
        //
        let savable     = this.common.isSavableObject (
            this.common.freeform['groups'][modelid]['objects'][id]
        );


        if (savable) {
          // this form is savable -> create in server
          // resultGroup = await this.common.createFreeformNotFieldObject(
          //   FreeformCommonService.userId,
          //   FreeformCommonService.formModelId,
          //   FreeformCommonService.formId,
          //   this.common.freeform.groups[ modelid ].objects[id],
          //   modelid,
          //   id,
          //   'group'
          // );
        } else {
          // this form is not savable -> set result page true
        }
      }
    //@> create in db -> add to server



      if ( !resultGroup ) {
        // we can not update freeform savable object  -> STOP THIS FUNC
        console.log ( 'create group - 5.2 createFreeformNotFieldObject - resultGroup - STOP THIS FUNC - 4.2', resultGroup );
        return this.common.returnPromiseValue ( null );
      } else {
        //@ we can update field in server OR is not savable form - return callback

        // we success created row -> increase for counter finish recognizer
          this.common.invokeCallbackIfAllDoneOfCounter(iNcallback);

        //@< return promise because we use asyns function
          return this.common.returnPromiseValue( new FreeformReadyObjectModel(id) );
        //@> return promise because we use asyns function
      }
  }


  async createIfNeedSubFreeformObjects (iNobject, iNfreeformObject, iNnewInIdObject: object, iNfullDownloaded: boolean, iNcallback) {
    //@disc - create freeform of this object
    let thisObj = iNfreeformObject;
    try {
      // add groups (right format) to object
      for ( const rowKey in thisObj.body.rows ) {
        // parent object for child obj (group)
        const row = thisObj.body.rows[rowKey];
        const dataForChildObj = this.common.getParentOfObjForChildObj(
          iNobject['key'], // obj key
          iNobject['id'], // model id
          'group' //
        );
        const rowObj  = await this.rows.create(
          {
            'id'    : row['baseid'],
            'inid'  : row['objid'],
            'index' : rowKey
          }
          , dataForChildObj, iNnewInIdObject, iNfullDownloaded, iNcallback );

        if ( !rowObj ) {
          // we can not create sub group -> STOP this object
          console.log('createIfNeedSubFreeformObject- STOP THIS FUNCT ', iNobject, iNfreeformObject, iNnewInIdObject );
          return  this.common.returnPromiseValue(null);
        }
      }
      // return this freeform object
      return this.common.returnPromiseValue(thisObj);
    } catch (e) {
      console.log('createIfNeedSubFreeformObject group 6 ERR - STOP THIS FUNCT - e', e );
      return this.common.returnPromiseValue(null);
    }
  }

  async getObjectFromModel (iNobject: object, iNparentForChild = null, iNnewInIdObject, iNfullDownloaded, iNcallback): Promise<object> {
    // get model of this
    let model   =   this.common.freeform.groups[ iNobject['id'] ].base,
        object  =   this.common.getObjectWithShortData( this.common.connect.deepcopy(model), iNobject, true ), //this.common.connect.deepcopy(model);
        sorted;

    //@< add not readyState (because not server generation)
      object['clientGeneration'] = true;
    //@> add not readyState

    //@< generated data block && parent block
      const gen = object['body']['gen'] = {};
      // add to object (generated parent object)
      // gen['parent'] = iNparentForChild;
      this.common.setParentOfObjForChildObj (object, iNparentForChild);
    //@> generated data block && parent block

    //@< set new id and add to freeform
      object['id']        = iNobject['key']; //FreeformShared.safeGetInId (iNobject['inid'], false, iNnewInIdObject) ;
      object['position']  = iNobject['index'];
      this.common.freeform.groups[ iNobject['id'] ].objects[ object['id'] ] = object;
    //@> set new id and add to freeform

    //@< generate local id
      if (object['lid']) {
        this.common.setLocalId ('group', object, object['lid'], this.common.freeform, object['id'] );
      }
    //@> generate local id

    // clear groups from object
    object.body.rows = [];

    // add groups (right format) to object
    sorted = this.common.sortObjectByWeight( model.body.rows );// row
    for (let rowKey in sorted ) {
      const row           = sorted[rowKey];
            row['index']  = rowKey;

      // parent object for child obj (group)
      const dataForChildObj = this.common.getParentOfObjForChildObj(
        iNobject['key'], // obj key
        iNobject['id'], // model id
        'group', //
        iNparentForChild // greate parent block
      );
      // const dataForChildObj = this.common.getParentOfObjForChildObj(
      //   iNobject['key'], // obj key
      //   iNobject['id'], // model id
      //   'group' //
      // );

      let rowObject   = await this.rows.create(row, dataForChildObj, iNnewInIdObject, iNfullDownloaded, iNcallback);
      if (!rowObject) {
        // we can not create sub group -> STOP this object
        return this.common.returnPromiseValue(null);

      }
      let objRef      = { baseid  : row['id'], objid   : rowObject['id'] };
      // check iner id if isset
      if ( row['inid'] ) { objRef['inid'] = this.common.safeGetInId (row['inid'], rowObject['id'], iNnewInIdObject) ; }
      // add to array
      object.body.rows.push( objRef );
    }

    if ( iNobject['inid'] ) {
      // object['id'] = iNobject['inid'];
      object['id'] = this.common.safeGetInId (iNobject['inid'], false, iNnewInIdObject) ;
    }
    // return object in need format

    return this.common.returnPromiseValue(this.common.getObjectWithShortData(object, iNobject, true));
  }

}
