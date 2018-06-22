import {Injectable} from '@angular/core';
import {FreeformCommonService} from './freeform.common.service';
import {FreeformGroupService} from './freeform.group.service';
import {FreeformReadyObjectModel} from '../model/freeform.model';
import {FreeformObjectInterface} from './freeform.object.interface';
import {isNegativeNumberLiteral} from 'tslint';
@Injectable()
export class FreeformPageService  { //  implements FreeformObjectInterface
  // global freeform object
  freeform;

  constructor (
    private common: FreeformCommonService,
    private groups: FreeformGroupService
  ) {

  }

  async init () {
    // get freeform after invoke init method of this
    const freeform = this.common.freeform;
    // for output text error
    let error = null;

    // set finish counter
    this.common.initFinishRecognizeCounter();

    //**DELETE LATER
    window['freeform'] = freeform;

    //**LATER delete st and et timers && logs
    let st = new Date().getTime();

    //preload fields if for form define preloading
    let preloadStatus = this.common.getPreloadStatusOfForm(),
        fullDownloaded = false;
    if ( preloadStatus === 'all') {
      fullDownloaded = true;
    }
    let et = new Date().getTime();
    console.log('preload result', et - st);


    //@< checking
      // check map
      if (Array.isArray(freeform.map) && freeform.map.length > 0) {
        const map = freeform.map;
        // iterate array
        for (const thisMapKey in map) {
          const thisMap = map[thisMapKey];
          if ( !this.checkMap(thisMap['baseid'], thisMap['objid']) ) {
            // create <= page object not isset
            let result = null;
            try {
              result = await this.create(
                { id: thisMap['baseid'], inid: thisMap['objid'], 'index': thisMapKey },
                null,
                false,
                null,
                fullDownloaded,
                () => {
                  // we full downloaded form -> set status to downloaded (show form)
                  this.common.setFormStatusToDownloaded();
                }
              );
            } catch (e) {
              console.log('page create from map- errror - e', e)

            }
            if (!result) {
              // we have error -> output error -> stop this funct
              //**LATER delete fixed values -> add multi dictionary
              error = 'Не возможно открыть форму.';
              this.common.freeform.error = error;
              return;
            }
          }
        }
        // stop function
        return;
      }
    //@> checking

      // get pageId from initialMap => create page object
      let sorted = this.common.sortObjectByWeight(freeform['initialMap']);
      for (const pageKey in sorted ) {
        // create page object
        let page    = sorted[pageKey],
            result  = null;

        page['index'] = pageKey;

        try{
          result = await this.create(
            page,
            null,
            true,
            null,
            fullDownloaded,
            () => {
                // we full downloaded form -> set status to downloaded (show form)
                this.common.setFormStatusToDownloaded();
              }
            );

        } catch (e) {
          console.log('page create from initial map - errror - e', e)
        }
        if (!result) {
          // we have error -> output error -> stop this funct
          //**LATER delete fixed values -> add multi dictionary
          error = 'Не возможно открыть форму.';
          this.common.freeform.error = error;
          return;
        }
      }

  }

  check (iNobject) {
    if (!this.common.freeform.pages) {
      this.common.freeform.pages = {};
    }
    if (!this.common.freeform.pages[ iNobject['id'] ]) {
      this.common.freeform.pages[ iNobject['id'] ] = {};
    }
    if (!this.common.freeform.pages[ iNobject['id'] ].objects) {
      this.common.freeform.pages[ iNobject['id'] ].objects = {};
    }
  }

  async create (iNobject: object, iNparentForChild = null, iNaddToMap: boolean = true, iNnewInIdObject = null, iNfullDownloaded: boolean = false, iNcallback): Promise<object>  {

    // increase counter finish recognizer
    this.common.addCounterOperation();

    this.check(iNobject);


    // generated random key for this object
    const id      = iNobject['key'] = this.common.safeGetInId(iNobject['inid'], this.common.connect.getUuid(), iNnewInIdObject),
          modelid = iNobject['id'];


    // if isset this group not create from model
    let modelFromLocal = null,
        objectFromLocal = null,
        objModel = null,
        objObject;

    //@< check for isset model
      if (
        (
          this.common.freeform['pages'] &&
          this.common.freeform['pages'][modelid]
        )
      ) {
        // we have this model
        modelFromLocal = objModel = this.common.freeform['pages'][modelid];
      } else if (!iNfullDownloaded) {
        // we have not this model local -> get from db
        objModel = await this.common.getElementFromFormObject (
          'page',
          'model',
          FreeformCommonService.userId,
          FreeformCommonService.formModelId,
          FreeformCommonService.formId,
          modelid
        );
        if (objModel) {
          this.common.freeform['pages'][modelid] = { 'base' : objModel, objects: {} };
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
          this.common.freeform['pages'][modelid]['objects'][id] &&
          this.common.freeform['pages'][modelid]['objects'][id]['fromLocal'] !== false
        )
      ) {
        // we have this field on server -> not create this field -> return field
        console.log('page object is isset', modelid, id);
        objectFromLocal = objObject = this.common.freeform['pages'][modelid]['objects'][id];
        // return this.common.returnPromiseValue(new FreeformReadyObjectModel(id));
      } else if (
        !iNfullDownloaded &&
        !this.common.isSimpleForm() &&
        !objObject &&
        this.common.isSavableObject(this.common.freeform['groups'][modelid])
      ) {
        console.log('page object is NOT isset', modelid, id);
        objObject = await this.common.getElementFromFormObject (
          'page',
          'object',
          FreeformCommonService.userId,
          FreeformCommonService.formModelId,
          FreeformCommonService.formId,
          modelid
        );
      }
    //@> check for isset object

    //@ we have NOT this field OR we have local field only -> create this field -> add to server

    //@< get page object from model OR (if iseet yet) create safe sub freeform objects
      if ( objObject ) {
        // we have this page object already -> create if need sub freeform objects
        objObject = await this.createIfNeedSubFreeformObjects(iNobject, objObject, iNnewInIdObject, iNfullDownloaded, iNcallback );
      } else {
        // wa have not this freeform objec yet -> create from model with create sub objects
        objObject = await this.getObjectFromModel(iNobject, iNparentForChild, iNnewInIdObject, iNfullDownloaded, iNcallback);
      }

      if (!objObject) {
        // if we canot get this freeform object -> stop this func
        console.log('create page 2.21 - STOP THIS FUNCT');
        return this.common.returnPromiseValue(null);
      }
    //@> get page object from model OR (if iseet yet) create safe sub freeform objects

    //pre step create
    let sortedPre = this.common.sortObjectByWeight( this.common.freeform.pages[ modelid ].base['pre'] );
    for ( const prePageKey in sortedPre ) {
      const prePage = sortedPre[prePageKey],
            objRef  = { 'id' : prePage['id'], 'baseid'  : prePage['id'], 'index': prePageKey };
      // check iner id if isset
      if ( prePage['inid'] ) {
        objRef['inid'] = this.common.safeGetInId (prePage['inid'], false, iNnewInIdObject);
        // objRef['inid'] = prePage['inid'];
      }
      const prePageObject     = await this.create( objRef, false, false, iNnewInIdObject, iNfullDownloaded, iNcallback);

      if ( !prePageObject ) {
        console.log ( 'createFreeformNotFieldObject - can not create pre object - STOP THIS FUNC - 2.1', prePageObject );
        return this.common.returnPromiseValue(null);
      }

      objRef ['objid']    = prePageObject['id'];

      // add to array
      prePage['pre'].push( objRef );
    }

    // add object to freeform object with merge old object
    let obj = {};
    if (
      this.common.freeform.pages &&
      this.common.freeform.pages[modelid] &&
      this.common.freeform.pages[modelid].objects &&
      this.common.freeform.pages[modelid].objects[id]
    ) {
      obj = this.common.freeform.pages[modelid].objects[id];
    }
    // if ( typeof obj !== 'object' ) { obj = {}; }
    this.common.freeform.pages[modelid].objects[id] = Object.assign( objObject, obj );

    // add to map this page
    if (iNaddToMap) {
      await this.addPageToMap(modelid, id);
    }

    // post step create
    let sortedPost = this.common.sortObjectByWeight( this.common.freeform.pages[ modelid ].base['post'] );
    for ( const postPageKey in sortedPost ) {
      const postPage  = sortedPost[postPageKey],
            objRef    = { 'id' : postPage['id'], 'baseid'  : postPage['id'], 'index' : postPageKey };
      // check iner id if isset
      if ( postPage['inid'] ) {
        // objRef['inid'] = postPage['inid'];
        this.common.safeGetInId (postPage['inid'], false, iNnewInIdObject);
      }
      const postPageObject    = await this.create( objRef, false, false, iNnewInIdObject, iNfullDownloaded, iNcallback);
      if ( !postPageObject ) {
        console.log ( 'createFreeformNotFieldObject - can not create post object - STOP THIS FUNC - 4.1', postPageObject );
        return this.common.returnPromiseValue(null);
      }
      objRef ['objid']  = postPageObject['id'];
      // add to array
      postPage['pre'].push( objRef );
    }

    let resultPage = true;

    //@< create in db -> add to server
      if (
        !objectFromLocal ||
        objectFromLocal['fromLocal']
      ) {
        //**LATER or CHANGE delete if we will not need client firestore generating
        // if we generated this object on client
        console.log('page generating', modelid, id, objectFromLocal);
        // delete local value before server sign
        delete this.common.freeform['pages'][modelid]['objects'][id]['fromLocal'];

        let savable     = this.common.isSavableObject (
          this.common.freeform['pages'][modelid]['objects'][id]
        );

        if (savable) {
          // this form is savable -> create in server
          // resultPage =  await this.common.createFreeformNotFieldObject (
          //   FreeformCommonService.userId,
          //   FreeformCommonService.formModelId,
          //   FreeformCommonService.formId,
          //   this.common.freeform.pages[iNobject['id']].objects[id],
          //   modelid,
          //   id,
          //   'page'
          // );
        } else {
          // this form is not savable -> set result page true
          // resultPage = true;
        }
      }
    //@> create in db -> add to server



      if ( !resultPage ) {
        // we can not update freeform savable object  -> STOP THIS FUNC
        console.log ( 'createFreeformNotFieldObject - resultPAge - STOP THIS FUNC - 4.2', resultPage );
        return this.common.returnPromiseValue ( null );
      } else {
        //@ we can update field in server OR is not savable form - return callback

        // we success created page -> increase for counter finish recognizer
        this.common.invokeCallbackIfAllDoneOfCounter(iNcallback);

        //@< return promise because we use asyns function
          return this.common.returnPromiseValue( new FreeformReadyObjectModel(id) );
        //@> return promise because we use asyns function
      }
  }

  async createIfNeedSubFreeformObjects (iNobject, iNfreeformObject, iNnewInIdObject, iNfullDownloaded, iNcallback) {
    //@disc - create freeform of this object
    let thisObj = iNfreeformObject;
    try {
      // add groups (right format) to object
      for ( const groupKey in thisObj.body.groups ) {
        // parent object for child obj (group)
        const group = thisObj.body.groups[groupKey];
        const dataForChildObj = this.common.getParentOfObjForChildObj(
          iNobject['key'], // obj key
          iNobject['id'], // model id
          'page' //
        );
        const groupObj  = await this.groups.create(
          {
            'id'    : group['baseid'],
            'inid'  : group['objid'],
            'index' : groupKey
          }
          , dataForChildObj, iNnewInIdObject, iNfullDownloaded, iNcallback);

        if ( !groupObj ) {
          // we can not create sub group -> STOP this object
          console.log('createIfNeedSubFreeformObject- STOP THIS FUNCT ', iNobject, iNfreeformObject, iNnewInIdObject );
          return  this.common.returnPromiseValue(null);
        }
      }
      // return this freeform object
      return this.common.returnPromiseValue(thisObj);
    } catch (e) {
      console.log('createIfNeedSubFreeformObject page ERR - STOP THIS FUNCT - e', e );
      return this.common.returnPromiseValue(null);
    }
  }

  async getObjectFromModel (iNobject: object, iNparentForChild, iNnewInIdObject, iNfullDownloaded, iNcallback): Promise<object> {
    // get model of this
    const model     = this.common.freeform.pages[iNobject['id']].base,
          object    = this.common.getObjectWithShortData( this.common.connect.deepcopy(model), iNobject, true ) ;

    //@< add not readyState (because not server generation)
      object['clientGeneration'] = true;
    //@> add not readyState

    //@< generated data block && parent block
      const gen = object['body']['gen'] = {};
      // add to object (generated parent object)
      this.common.setParentOfObjForChildObj (object, iNparentForChild);
    //@> generated data block && parent block

    //@< set new id and add to freeform
      object['id']        = iNobject['key']; //FreeformShared.safeGetInId (iNobject['inid'], false, iNnewInIdObject) ;
      object['position']  = iNobject['index'];
      this.common.freeform.pages[ iNobject['id'] ].objects[ object['id'] ] = object;
    //@> set new id and add to freeform

    // clearing
      // clear groups from object
      object.body.groups = [];

    // add groups (right format) to object
    let sorted = this.common.sortObjectByWeight(model.body.groups);
    for ( const groupKey in sorted ) {
      // parent object for child obj (group)
      const group           = sorted[groupKey];
            group['index']  = groupKey;

      const dataForChildObj = this.common.getParentOfObjForChildObj(
        iNobject['key'], // obj key
        iNobject['id'], // model id
        'page', //
        iNparentForChild // greate parent block
      );
      const groupObj  = await this.groups.create(group, dataForChildObj, iNnewInIdObject, iNfullDownloaded, iNcallback);
      if (!groupObj) {
        // we can not create sub group -> STOP this object
        return this.common.returnPromiseValue(null);
      }

      let   objRef    = { baseid  : group['id'], objid   : groupObj['id'] };
      // check iner id if isset
      if ( group['inid'] ) { objRef['inid'] = this.common.safeGetInId (group['inid'], group['id'], iNnewInIdObject) ; }
      // if ( group['inid'] ) { objRef['inid'] = group['inid']; }
      // add to array
      object.body.groups.push ( objRef );
    }


    // add inid
    if ( iNobject['inid'] ) { object['id'] = this.common.safeGetInId (iNobject['inid'],false, iNnewInIdObject) ;  }


    // return object in need format
    return this.common.returnPromiseValue(this.common.getObjectWithShortData(object, iNobject, true));
  }



  checkMap (iNpageId: string, iNobjId: string) {
    if (
      this.common.freeform &&
      this.common.freeform.pages[iNpageId] &&
      this.common.freeform.pages[iNpageId].objects &&
      this.common.freeform.pages[iNpageId].objects[iNpageId]
    ) { return this.common.freeform.pages[iNpageId].objects[iNpageId]; }
    return null;
  }

  async addPageToMap  (iNpageId: string, iNobjId: string) {
    // create map array if not isset
    if (!Array.isArray(this.common.freeform.map) ) { this.common.freeform.map = []; }
    const map = this.common.freeform.map;
    // add to map
    map.push(
      {
        baseid: iNpageId,
        objid :  iNobjId
      }
    );

    // sync with db from server
    await this.common.syncFormMap (
      FreeformCommonService.userId,
      FreeformCommonService.formModelId,
      FreeformCommonService.formId,
       map
    );
  }
}
