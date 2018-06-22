import {Injectable} from '@angular/core';
import {FreeformCommonService} from './freeform.common.service';
import {FreeformReadyObjectModel} from '../model/freeform.model';
import {FreeformObjectInterface} from './freeform.object.interface';
import {FreeformFieldService} from './freeform.field.service';
@Injectable()
export class FreeformRowService implements FreeformObjectInterface   {
  constructor (
    private common: FreeformCommonService,
    private fields: FreeformFieldService
  ) {
  }

  check (iNrow) {
    if (!this.common.freeform.rows[iNrow['id']].objects) { this.common.freeform.rows[iNrow['id']].objects = {}; }
  }

  async create (iNrow: object, iNparentForChild = null, iNnewInIdObject = null, iNfullDownloaded = false, iNcallback = null): Promise<object> {

    // increase counter finish recognizer
      this.common.addCounterOperation();

    this.check (iNrow);

    // generated random key for this object
    let id      = iNrow['key'] = this.common.safeGetInId(iNrow['inid'], this.common.connect.getUuid(), iNnewInIdObject),
        modelid = iNrow['id'];

    // if isset this group not create from model
    let modelFromLocal = null,
        objectFromLocal = null,
        objModel = null,
        objObject;

    //@< check for isset model
      if (
        (
          this.common.freeform['rows'] &&
          this.common.freeform['rows'][modelid]
        )
      ) {
        // we have this model
        modelFromLocal = objModel = this.common.freeform['rows'][modelid];
      } else if (!iNfullDownloaded) {
        // we have not this model local -> get from db
        objModel = await this.common.getElementFromFormObject (
          'row',
          'model',
          FreeformCommonService.userId,
          FreeformCommonService.formModelId,
          FreeformCommonService.formId,
          modelid
        );
        if (objModel) {
          this.common.freeform['rows'][modelid] = { 'base' : objModel, objects: {} };
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
          this.common.freeform['rows'][modelid]['objects'][id] &&
          this.common.freeform['rows'][modelid]['objects'][id]['fromLocal'] !== false
        )
      )  {
        // we have this field on server -> not create this field
        console.log('row object is isset', modelid, id);
        objectFromLocal = this.common.freeform['rows'][modelid]['objects'][id];
      } else if (
        !iNfullDownloaded &&
        !this.common.isSimpleForm() &&
        !objObject &&
        this.common.isSavableObject(this.common.freeform['rows'][modelid])
      ) {
        console.log('row object is NOT isset', modelid, id);
        objObject = await this.common.getElementFromFormObject (
          'row',
          'object',
          FreeformCommonService.userId,
          FreeformCommonService.formModelId,
          FreeformCommonService.formId,
          modelid
        );
      }
    //@> check for isset object

    // get page object
    //@< get row object from model OR (if iseet yet) create safe sub freeform objects
    if ( objectFromLocal ) {
      // we have this row object already -> create if need sub freeform objects
      objObject = await this.createIfNeedSubFreeformObjects(iNrow, objectFromLocal, iNnewInIdObject, iNfullDownloaded, iNcallback );
    } else {
      // wa have not this freeform objec yet -> create from model with create sub objects
      objObject = await this.getObjectFromModel(iNrow, iNparentForChild, iNnewInIdObject, iNfullDownloaded, iNcallback);
    }

    if (!objObject) {
      // if we canot get this freeform object -> stop this func
      console.log('create row 2.21 - STOP THIS FUNCT');
      return this.common.returnPromiseValue(null);
    }
    //@> get group object from model OR (if iseet yet) create safe sub freeform objects

    //pre step create
      let sortedPre = this.common.sortObjectByWeight( this.common.freeform.rows[iNrow['id']].base.pre );
      for ( let preRowKey in sortedPre ) {
        let preRow          = sortedPre[preRowKey], preRowObject;
            preRow['index'] = preRowKey;

            preRowObject  = await this.create(preRow, iNparentForChild, iNnewInIdObject, iNcallback);

        if ( !preRowObject ) {
          console.log('row create 3.1 -  - can not create pre field object - STOP THIS FUNC');
          return this.common.returnPromiseValue( null );
        }

        let  objRef          = { baseid  : preRow['id'], objid   : preRowObject['id'] };
        // check iner id if isset
        if ( preRow['inid'] ) { objRef['inid'] = this.common.safeGetInId (preRow['inid'], preRowObject['id'], iNnewInIdObject) ; }
        // add to array
        objObject.pre.push( objRef );
      }



    // post step create
      let sortedPost = this.common.sortObjectByWeight( this.common.freeform.rows[iNrow['id']].base.post );
      for ( let postRowKey in sortedPost  ) {
        let postRow           = sortedPost[postRowKey], postRowObject;
            postRow['index']  = postRowKey;

            postRowObject   = await this.create(postRow, iNparentForChild, iNnewInIdObject, iNfullDownloaded, iNcallback);

        if ( !postRowObject ) {
          console.log('row create 4.1 -  - can not create post field object - STOP THIS FUNC');
          return this.common.returnPromiseValue( null );
        }

        let objRef            = { baseid  : postRow['id'], objid   : postRowObject['id'] };
        // check iner id if isset
        if ( postRow['inid'] ) { objRef['inid'] = this.common.safeGetInId (postRow['inid'], postRowObject['id'], iNnewInIdObject) ; }

        // add to array
        objObject.post.push( objRef );
      }

    // create dependedents for this element
    this.common.scanRulesOfObject(objObject);


    // add object to freeform object with merge old object
    let obj = this.common.freeform.rows[iNrow['id']].objects[id];
    if ( typeof obj !== 'object' ) { obj = {}; }
    this.common.freeform.rows[iNrow['id']].objects[id] = Object.assign( objObject, obj );

    let resultGroup = true;
    //@< create in db -> add to server
        if (
          !objectFromLocal ||
          objectFromLocal['fromLocal']
        ) {
          //**LATER or CHANGE delete if we will not need client firestore generating
          // if we generated this object on client
            console.log('row generating', modelid, id, objectFromLocal);
          // delete local value before server sign
            delete this.common.freeform['rows'][modelid]['objects'][id]['fromLocal'];

            let savable     = this.common.isSavableObject (
              this.common.freeform['rows'][modelid]['objects'][id]
            );

            if (savable) {
              // this form is savable -> create in server
              // resultGroup = await this.common.createFreeformNotFieldObject(
              //   FreeformCommonService.userId,
              //   FreeformCommonService.formModelId,
              //   FreeformCommonService.formId,
              //   this.common.freeform.rows[modelid].objects[id],
              //   modelid,
              //   id,
              //   'row'
              // );
            } else {
              // this form is not savable -> set result page true
              // resultGroup = true;
            }
        }
    //@> create in db -> add to server


      if ( !resultGroup ) {
        // we can not update freeform savable object  -> STOP THIS FUNC
        console.log ( 'create row - 5.2 createFreeformNotFieldObject - resultGroup - STOP THIS FUNC - 4.2', resultGroup );
        return this.common.returnPromiseValue ( null );
      } else {
        // we can update - return callback

        // we success created field -> increase for counter finish recognizer
          this.common.invokeCallbackIfAllDoneOfCounter(iNcallback);

        //@< return promise because we use asyns function
          return this.common.returnPromiseValue( new FreeformReadyObjectModel(id) );
        //@> return promise because we use asyns function
      }

  }

  async createIfNeedSubFreeformObjects (iNobject, iNfreeformObject, iNnewInIdObject, iNfullDownloaded = false, iNcallback) {
    //@disc - create freeform of this object
    let thisObj = iNfreeformObject;
    try {
      // add groups (right format) to object
      for ( const fieldKey in thisObj.body.fields ) {
        let field = thisObj.body.fields[fieldKey];

        // parent object for child obj (group)
        const dataForChildObj = this.common.getParentOfObjForChildObj(
          iNobject['key'], // obj key
          iNobject['id'], // model id
          'row' //
        );
        const fieldObj  = await this.fields.create(
          {
            'id'    : field['baseid'],
            'inid'  : field['objid'],
            'index' : fieldKey
          }
          , dataForChildObj, iNnewInIdObject, iNfullDownloaded, iNcallback);

        if ( !fieldObj ) {
          // we can not create sub group -> STOP this object
          console.log('createIfNeedSubFreeformObject row - STOP THIS FUNCT ', iNobject, iNfreeformObject, iNnewInIdObject );
          return  this.common.returnPromiseValue(null);
        }
      }
      // return this freeform object
      return this.common.returnPromiseValue(thisObj);
    } catch (e) {
      console.log('createIfNeedSubFreeformObject  row  6 ERR - STOP THIS FUNCT - e', e );
      return this.common.returnPromiseValue(null);
    }
  }


  async getObjectFromModel (iNobject, iNparentForChild = null,  iNnewInIdObject = null, iNfullDownloaded = false, iNcallback) {
    // get model of this
    const model   =   this.common.freeform.rows[iNobject['id']].base,
          object  =   this.common.getObjectWithShortData( this.common.connect.deepcopy(model), iNobject, true ) ;//this.common.connect.deepcopy(model);

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
      this.common.freeform.rows[ iNobject['id'] ].objects[ object['id'] ] = object;
    //@> set new id and add to freeform

    //@< generate local id
      if (object['lid']) {
        this.common.setLocalId ('row', object, object['lid'], this.common.freeform, object['id'] );
      }
    //@> generate local id


    // clear fields from object
    object.body.fields = [];
    // add rows (right format) to object
    let sortedFields = this.common.sortObjectByWeight( model.body.fields );
    for (let fieldKey in sortedFields) {
      let field           = sortedFields[fieldKey];
          field['index']  = fieldKey;

      // parent object for child obj (group)
      const dataForChildObj = this.common.getParentOfObjForChildObj(
        iNobject['key'], // obj key
        iNobject['id'], // model id
        'row', //
        iNparentForChild // greate parent block
      );
      let fieldsObject  = await this.fields.create(field, dataForChildObj, iNnewInIdObject, iNfullDownloaded, iNcallback);

      if (!fieldsObject) {
        console.log('row create - can not create field -> STOP THIS FUNC');
        return this.common.returnPromiseValue(null );
      }

      let  objRef    = { baseid  : field['id'], objid   : fieldsObject['id'] };
      // check iner id if isset
      objRef['inid'] = this.common.safeGetInId (field['inid'], fieldsObject['id'], iNnewInIdObject) ;

      // add to array
      object.body.fields.push( objRef );
    }

    if ( iNobject['inid'] ) {
      // object['id'] = iNobject['inid'];
      object['id'] = this.common.safeGetInId (iNobject['inid'], false, iNnewInIdObject) ;
    }

    // return object in need format
    return this.common.returnPromiseValue( this.common.getObjectWithShortData(object, iNobject, true) );

  }

}
