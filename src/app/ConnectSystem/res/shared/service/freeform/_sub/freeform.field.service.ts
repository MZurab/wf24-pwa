import {Injectable} from '@angular/core';
import {FreeformCommonService} from './freeform.common.service';
import {FreeformReadyObjectModel} from '../model/freeform.model';
import {FreeformObjectInterface} from './freeform.object.interface';
@Injectable()
export class FreeformFieldService implements FreeformObjectInterface   {
  constructor (
    private common: FreeformCommonService
  ) {
  }


  check (iNfield) {


    if ( !this.common.freeform['fields']) { this.common.freeform['fields'] = {}; }
    if ( !this.common.freeform.fields[iNfield['id']] ) { this.common.freeform['fields'][ iNfield['id'] ] = {}; }
    if ( !this.common.freeform.fields[iNfield['id']].objects) { this.common.freeform.fields[iNfield['id']].objects = {}; }
  }

  addDepends (iNobject) {
    if (
      typeof iNobject['body']['rules'] == 'object' &&
      Array.isArray(iNobject['body']['rules']['for']) &&
      iNobject['body']['rules']['for'].length > 0
    ) {
      let forArray = iNobject['body']['rules']['for'];
      for ( let thisEl of forArray) {
        let inid = thisEl['inid'];
        if (!inid) continue;

        let dependObject = this.common.getFreefomObjectByInId(inid);

        //check depends
      }
    }
  }

  async create (iNfield: object, iNparentForChild: object = null, iNnewInIdObject: object, iNfullDownloaded: boolean = false, iNcallback = null): Promise<object> {


    // increase counter finish recognizer
      this.common.addCounterOperation();

    // try to get id (key) by inner id (inid)
    let   id      = iNfield['key'] = this.common.safeGetInId(iNfield['inid'], this.common.connect.getUuid(), iNnewInIdObject),
          modelid = iNfield['id'];

    // start timer countdown for set this to downloader
    // this.common.setFormStatusToDownloaded();


    // if isset this group not create from model
    let modelFromLocal = null,
        objectFromLocal = null,
        objModel = null,
        objObject;

    //@< check field model for isset  in local
      //**LATER добавить зашиту от несушествующих моделей не полей (сейчас нет зашиты на несушествующие модели)
      if (
        (
          this.common.freeform['fields'] &&
          this.common.freeform['fields'][modelid]
        )
      )  {
        modelFromLocal = objModel = this.common.freeform['fields'][modelid];
      } else if (!iNfullDownloaded) {
        // we have not this model local -> get from db
        console.log('field model is isset', modelid);

        objModel = await this.common.getElementFromFormObject (
          'field',
          'model',
          FreeformCommonService.userId,
          FreeformCommonService.formModelId,
          FreeformCommonService.formId,
          modelid
        );
        if (objModel) {
          this.common.freeform['fields'][modelid] = { 'base' : objModel, objects: {} };
        }
      }

      if (!objModel) {
        // we have not this model yet -> error end
        return this.common.returnPromiseValue(null);
      }
    //@> check field model for isset in local

    // start timer countdown for set this to downloader
    // this.common.setFormStatusToDownloaded();


    //@< check for isset object
      if (
          this.common.freeform['fields'][modelid]['objects'] &&
          this.common.freeform['fields'][modelid]['objects'][id]
      ) {
        // field isset (it's preloading) -> or it's from simplefield
        objObject = objectFromLocal = this.common.freeform['fields'][modelid]['objects'][id];
        console.log('field object is isset', modelid, id);
      } else if (
        !iNfullDownloaded &&
        !this.common.isSimpleForm() &&
        !objObject &&
        this.common.isSavableObject(objModel)
      ) {
        console.log('field object is NOT isset', modelid, id);
        objObject = await this.common.getElementFromFormObject(
          'field',
          'object',
          FreeformCommonService.userId,
          FreeformCommonService.formModelId,
          FreeformCommonService.formId,
          modelid
        );
      }
    //@> check for isset object

    if (objObject) {
      // we get field object from db -> add to local freform -> save this field to local object
      this.common.freeform['fields'][modelid]['objects'][id] = objObject;
    }

    // start timer countdown for set this to downloader
    // this.common.setFormStatusToDownloaded();

    if ( objObject ) {
      // we have field yet -> calllback this field

      // we success created field -> increase for counter finish recognizer
        this.common.invokeCallbackIfAllDoneOfCounter(iNcallback);

      return this.common.returnPromiseValue( new FreeformReadyObjectModel(id) );
    }

    //@ we have not field object in db -> create from model -> callback  (end)

    // start timer countdown for set this to downloader
    // this.common.setFormStatusToDownloaded();

    // get field object
    let groupObject = await this.getObjectFromModel(iNfield, iNparentForChild, iNnewInIdObject, iNfullDownloaded, iNcallback);


    if ( !groupObject ) {
      // start timer countdown for set this to downloader
      // this.common.setFormStatusToDownloaded();

      console.log('field create 4.0 - CAN NOT GET FIELD OBJECT FROM MODEL - STOP THIS FUNCT');
      return this.common.returnPromiseValue(null );
    }




    //pre step create
    let sortedPre = this.common.freeform.fields[iNfield['id']].base.pre;
    for ( let preFieldKey in sortedPre ) {
      let preField          = sortedPre[preFieldKey];
          preField['index'] = preFieldKey;

      let preGroupObject   = await this.create ( preField, iNparentForChild, iNnewInIdObject, iNfullDownloaded, iNcallback );

      if ( !preGroupObject ) {
        console.log('field create 4.2 - CAN NOT PRE FIELD - STOP THIS FUNCT');
        return this.common.returnPromiseValue(null);
      }

      let objRef           = { baseid  : preField['id'], objid   : preGroupObject['id'] };
      // check iner id if isset
      if ( preField['inid'] ) { objRef['inid'] = this.common.safeGetInId (preField['inid'], preGroupObject['id'], iNnewInIdObject) ; }

      // add to array
      groupObject['pre'].push( objRef );
    }

    // post step create
    let sortedPost = this.common.freeform.fields[iNfield['id']].base.post;
    for ( let postFieldKey in sortedPost ) {
      let postField           = sortedPost[postFieldKey];
          postField['index']  = postFieldKey;

      let postGroupObject   = await this.create( postField, iNparentForChild, iNnewInIdObject, iNfullDownloaded, iNcallback );

      if ( !postGroupObject ) {
        console.log('field create 5.2 - CAN NOT POST FIELD STOP THIS FUNCT');
        return this.common.returnPromiseValue(null);
      }
      let objRef            = { baseid  : postField['id'], objid   : postGroupObject['id'] };

      // check iner id if isset
      if ( postField['inid'] ) { objRef['inid'] = this.common.safeGetInId (postField['inid'], postGroupObject['id'], iNnewInIdObject) ; }

      // add to array
      groupObject['post'].push( objRef );
    }

    // create dependedents for this element
    this.common.scanRulesOfObject(groupObject);

    // add object to freeform object with merge old object if isset
    let obj;
    if (
      typeof this.common.freeform.fields[ modelid ]['objects'] === 'object' &&
      typeof this.common.freeform.fields[ modelid ].objects[id] === 'object'
    ) {
      obj = this.common.freeform.fields[ modelid ].objects[id];
    } else {
      obj = {};
    }
    if ( typeof obj !== 'object' ) { obj = {}; }
    this.common.freeform.fields[ modelid ].objects[id] = this.common.connect.mergeObject(obj, groupObject);


    // start timer countdown for set this to downloader
    // this.common.setFormStatusToDownloaded();

    let result: boolean = true;

    //@<  add to freeform server
      if (
        !objectFromLocal ||
        objectFromLocal['fromLocal']
      ) {
        let savable     = this.common.isSavableObject (
          this.common.freeform['fields'][modelid]['objects'][id]
        );

        if (savable) {
          // this form is savable -> create in server
          // result = await this.common.createField (
          //   this.common.freeform.fields[ modelid ].objects[id],
          //   FreeformCommonService.userId,
          //   FreeformCommonService.formModelId,
          //   FreeformCommonService.formId,
          //   modelid,
          //   id
          // );
        }
      }
    //@>  add to freeform server

      if ( !result ) {
        // we can not update freeform savable object  -> STOP THIS FUNC
        console.log('field create 8.2 CAN NOT CREATED FIELD - STOP THIS FUNCT');
        return this.common.returnPromiseValue(null);
      } else {
        //@ we can update field in server OR is not savable form - return callback

        // we success created field -> increase for counter finish recognizer
          this.common.invokeCallbackIfAllDoneOfCounter(iNcallback);

        //@< return promise because we use asyns function
          return this.common.returnPromiseValue(new FreeformReadyObjectModel( id ));
        //@> return promise because we use asyns function
      }
  }

  async getObjectFromModel (iNobject: object, iNparentForChild = null, iNnewInIdObject, iNfullDownloaded, iNcallback): Promise<object> {
    // get model of this
    let model   =   this.common.freeform.fields[ iNobject['id'] ].base,
        object  =   this.common.getObjectWithShortData( this.common.connect.deepcopy(model), iNobject, true ) ;

    //@< add not readyState (because not server generation)
      object['clientGeneration'] = true;
    //@> add not readyState


    //@< generated data block && parent block
      const gen = object['body']['gen'] = {};
      this.common.setParentOfObjForChildObj (object, iNparentForChild);
    //@> generated data block && parent block

    //@< set new id and add to freeform
      object['id']        = iNobject['key']; //FreeformShared.safeGetInId (iNobject['inid'], false, iNnewInIdObject) ;
      object['position']  = iNobject['index'];
      this.common.freeform.fields[ iNobject['id'] ].objects[ object['id'] ] = object;
    //@> set new id and add to freeform

    //@< generate local id
      if ( object['lid'] ) {
          this.common.setLocalId ('field', object, object['lid'], this.common.freeform, object['id'] );
      }
    //@> generate local id

    if (object.body['type'] === 'collection' && Array.isArray(model.body.fields) ) {
      // if this field collection -> we create filds clear fields from object

      object.body.fields = [];
      // add rows (right format) to object
      let sortedFields = this.common.sortObjectByWeight( model.body.fields );
      for (const fieldKey in sortedFields ) {
        let field           = sortedFields[fieldKey];
            field['index']  = fieldKey;

        // parent object of us (collection) for child obj (field)
        const dataForChildObj = this.common.getParentOfObjForChildObj(
          iNobject['key'], // obj key
          iNobject['id'], // model id
          'collection', //
          iNparentForChild // greate parent block
        );

        const fieldsObject  = await this.create(field, dataForChildObj, iNnewInIdObject, iNfullDownloaded, iNcallback);
        if ( !fieldsObject ) {
          console.log('field getObjectFromModel 3.3 - STOP THIS FUNCT', fieldsObject);
          return this.common.returnPromiseValue(null);
        }
        const objRef        = { baseid  : field['id'], objid   : fieldsObject['id'] };
        // check iner id if isset
        objRef['inid'] = this.common.safeGetInId (field['inid'], fieldsObject['id'], iNnewInIdObject) ;

        // add to array of object
        object.body.fields.push( objRef );
      }
    }

    // return object in need format
    return this.common.returnPromiseValue(object);
  }
}
