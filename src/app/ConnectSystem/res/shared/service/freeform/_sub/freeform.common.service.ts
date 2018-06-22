
import {Injectable} from '@angular/core';
import {FreeformFieldStateLibrary} from './freeform-field-state.library';
import {ConnectLibrary} from './connect.library';
import {FreeformCommonLibrary} from './freeform-common.library';
import {AngularFirestore} from 'angularfire2/firestore';
import {ConnectAuthService} from '../../user/connect-auth.service';
import {HttpClient} from '@angular/common/http';

enum OperationType {
  active = 0,
  notActive = 1,
  isExist = 2,
}
enum OperationMark {
  equal = 0,
  notEqual = 1,
  more = 2,
  less = 3,
  moreOrEqual = 4,
  lessOrEqual = 5,
}

interface _dependentObject {
  in_id: string;
  model_id: string;
  obj_type: string;
  type: OperationType;
  mark: OperationMark;
  value: string;
  weight: number;
  group: string;
}

@Injectable()
export class FreeformCommonService {
  static _freeform;
  get freeform() { return FreeformCommonService._freeform; }
  set freeform(Freeform) { FreeformCommonService._freeform = Freeform; }


  // connect library
  public connect = new ConnectLibrary();

  // freeform common library
  freeformCommon = new FreeformCommonLibrary();

  // data about form ouner - we add later user id belong open form
  static userId;

  // form model id - we add later form model id
  static formModelId;

  // form id - we add later form id
  static formId;


  // here we add field state library (in init)
  // fieldStateLibrary: FreeformFieldStateLibrary = ;
  _fieldStateLibrary = null;
  get fieldStateLibrary() {
    // let result = this._fieldStateLibrary || new FreeformFieldStateLibrary();
    return this._fieldStateLibrary = this._fieldStateLibrary || new FreeformFieldStateLibrary();
  }

  constructor (
    private firestore: AngularFirestore,
    private auth: ConnectAuthService,
    private http: HttpClient
  ) {
    // set firebase setting
    const settings = {timestampsInSnapshots: true};
    this.firestore.firestore.settings(settings);
  }

  //@< FIRESTORE

  //@< SIMPLEFIELD CHAPTER
    public isSimpleForm () {
      if (
        this['freeform']['options'] &&
        this['freeform']['options']['simpleForm']
      ) {
        return true;
      }
      return false;
    }
  //@> SIMPLEFIELD CHAPTER

  //@< PRELOAD CHAPTER

    public getPreloadStatusOfForm () {
      if (
        !this.isSimpleForm() &&
        this.freeform['options'] &&
        this.freeform['options']['preload']
      ) {
        return  this.freeform['options']['preload'];
      }
      return false;
    }

    private async addPreloadedFieldModel (iNmodelId, iNfieldModel) {
      this.freeform.fields[iNmodelId] = { 'base': iNfieldModel, 'objects': {} } ;
    }
    private async addPreloadedFieldObject (iNmodelId, iNfieldId, iNfieldObject) {
      this.freeform.fields[iNmodelId]['objects'][iNfieldId] = iNfieldObject;
    }
    // public async downloadPreloadFields (iNuid, iNformModelId, iNformId) {
    //
    //   if (!this.freeform.fields ) { this.freeform.fields = {}; }
    //
    //   const pathToDoc = `freeform/${iNuid}/model/${iNformModelId}/form/${iNformId}/field`;
    //   return new Promise(
    //     async (resolve) => {
    //       try {
    //         const result = await this.firestore.firestore.collection(pathToDoc).where('options.preload', '>', 0).get();
    //         for ( const model of result.docs) {
    //           // doc.data() is never undefined for query doc snapshots
    //           const fieldModel = model.data();
    //           if (fieldModel) {
    //             this.addPreloadedFieldModel( model.id, fieldModel );
    //           }
    //           const testvar = await this.getFieldObjByModel(iNuid, iNformModelId, iNformId, model.id);
    //         }
    //         resolve(true);
    //       } catch (e) {
    //         resolve(false);
    //       }
    //     }
    //   );
    // }

    private async getFieldObjByModel (iNuid, iNformModelId, iNformId, iNfieldModelId) {
      const pathToDoc = `freeform/${iNuid}/model/${iNformModelId}/form/${iNformId}/element/${iNfieldModelId}/object`;
      return new Promise(
        async (resolve) => {
          try {
            const result = await this.firestore.firestore.collection(pathToDoc).where('options.preload', '>', 0).get();

            for ( const field of result.docs) {
              const fieldObject = field.data();
              if (fieldObject) {
                this.addPreloadedFieldObject(  iNfieldModelId, field.id, fieldObject );
              }
            }
            resolve(true);
          } catch (e) {
            resolve(false);
          }
        }
      );
    }
  //@> PRELOAD CHAPTER

  //@< FINISH RECOGNIZER COUNTER
    initFinishRecognizeCounter () { //+
      this.freeform['counter'] = {
        willDo: 0,
        did: 0
      };
    }
    addCounterOperation () { //+
      this.freeform.counter.willDo++;
    }
    invokeCallbackIfAllDoneOfCounter (iNcallback) { //+
      this.didCounterOperation();
      let status = this.getResultIfAllDid();
      if (status) {
        if (typeof iNcallback === 'function') iNcallback();
      }
    }
    didCounterOperation () { //-
      this.freeform.counter.did++;
    }
    getResultIfAllDid () { //-
      return (this.freeform.counter.did === this.freeform.counter.willDo) ? true : false;
    }
  //@> FINISH RECOGNIZER COUNTER

  //@< PARENT OF ELEMENT
    getParentOfObjForChildObj (  iNobjId, iNmodelId, iNtype, iNgreatParent  = null) {
      let greatParent = iNgreatParent,
        result = greatParent || {},
        parenntKeys;

      // get keys for add parent date
      parenntKeys = this.freeformCommon.getKeysForParenIdAndModelId (iNtype);

      if ( !parenntKeys ) {
        return null;
      }

      // add/replace model id
      result[ parenntKeys['mid'] ] = iNmodelId;
      // add/replace object id
      result[ parenntKeys['id'] ] = iNobjId;
      // add/replace parent type
      result[ 'p-type' ] = iNtype;

      return result;
    }
    // set
      setParentOfObjForChildObj (iNelement, iNparentBlock) {
        let el_options = iNelement['options'];

        if (
          typeof iNparentBlock === 'object' &&
          iNparentBlock
        ) {
          // merge element options && parent block data
          this.connect.mergeObject(el_options, iNparentBlock);
          // return result
          return el_options;
        }
        return null;
      }
    //

  //@> PARENT OF ELEMENT

  //@< LOCAL ID FOR ELEMENTS

    getFreefomObjectId (iNfreeform, iNfolder, iNmodelId, iNid) {
      // get model of this
      const freeform   = this.freeform; //this._freeform;

      if (
        freeform &&
        freeform[iNfolder] &&
        freeform[iNfolder][iNmodelId] &&
        freeform[iNfolder][iNmodelId]['objects'] &&
        freeform[iNfolder][iNmodelId]['objects'][iNid]
      ) {
        return freeform[iNfolder][iNmodelId]['objects'][iNid];
      }

      return null;
    }

    addElLocalRefToParentLocal (iNparentElType , iNparentModelId, iNparentId, iNform, iNfolder, iNlid, iNlidKey, iNelId) {
      let fname           = 'addElLocalRefToParentLocal',
          folder          = iNfolder,
          parentModelId   = iNparentModelId,
          parentId        = iNparentId,
          lid             = iNlid,
          lkey            = iNlidKey,
          form            = iNform,
          elId            = iNelId,
          parentElType    = iNparentElType,
          parent_el       = this.getFreefomObjectId(form, folder, parentModelId , parentId);


      if (parent_el) {

        // we have parent element -> safe create gen block
        if ( !parent_el['body']['gen'] ){
          parent_el['body']['gen'] = {};
        }
        // safe created gen block -> safe create lid in gen block
        if ( !parent_el['body']['gen']['lid'] ) {
          parent_el['body']['gen']['lid'] = {};
        }
        // safe create gen block -> safe create lid in gen block
        let parentlocal = parent_el['body']['gen']['lid'];
        if ( lid[lkey] ) {
          // we have local ids for parent collection -> add child el id to parent collection
          for (let id of lid[lkey]) {
            parentlocal[id] = elId;
          }
        } else {
        }
        //
        if ( ( parentElType === 'collection' && ( lid['r'] || lid['g'] || lid['p']) ) ) {
          return this.setLocalId( 'field', parent_el, lid, form, elId );
        } else if ( parentElType === 'row' && ( lid['g'] || lid['p'] ) ) {
          return this.setLocalId( 'row', parent_el, lid, form, elId );
        } else if ( parentElType === 'group' && lid['p'] ) {
          return this.setLocalId( 'group', parent_el, lid, form, elId );
        }
      }
      return null;
    }

    setLocalId (iNelType, iNelement, iNlocalIdBlock, iNform, iNelId = null) {
      let fname = 'setLocalId',
          elType = iNelType,
          el = iNelement,
          form = iNform,
          lid = iNlocalIdBlock,
          parent,
          elId = iNelId;

      if (
        // el['body'] &&
      // el['body']['gen'] &&
      // el['body']['gen']['parent']
        el['options'] &&
        el['options']['p-type']
      ) {
        parent = this.freeformCommon.getParentBlockFromElement(el); //{'type': el['options']['p-type'], 'modelid': el['options']['p-mid'], 'objid': el['options']['p-id']};//el['body']['gen']['parent'];
        console.log(
          fname +' - parent, el',
          parent,
          el
        );
      } else {
        // error - we have not parent block
        return null;
      }

      if (parent && lid) {
        // we have parent block and locale id block -> generate lid
        let ptype = parent['type'],
          pmodelid = parent['mid'], // modelid
          pobjid = parent['id'], // objid
          parent_el;

        // if we have not locale id -> stop
        if (!lid) return false;

        switch (elType) {
          case "field":
            if (ptype === 'collection') {
              return this.addElLocalRefToParentLocal(ptype, pmodelid, pobjid, form, 'fields', lid, 'c', elId);
            } else if (ptype === 'row') {
              return this.addElLocalRefToParentLocal(ptype, pmodelid, pobjid, form, 'rows', lid, 'r', elId);
            }
            break;
          case "row":
            if (ptype !== 'group') return false;
            return this.addElLocalRefToParentLocal(ptype, pmodelid, pobjid, form, 'groups', lid, 'g', elId);
            // break;
          case "group":
            if (ptype !== 'page') return false;
            return this.addElLocalRefToParentLocal(ptype, pmodelid, pobjid, form, 'pages', lid, 'p', elId);
            // break;
        }
      }
      return false;
    }
  //@> LOCAL ID FOR ELEMENTS

  //@< WORK WITH ELEMENT
    async copy (iNthisElObject: object, iNaddTo: string, iNthisElementClass, iNshorData: object = null, iNcallback = null, iNwithValue: boolean = false) {
      //@disc - copy element with new ids
      console.log('copy - start - iNthisElObject, iNaddTo, iNshorData, iNwithValue', iNthisElObject, iNaddTo, iNshorData, iNwithValue );

      if (!iNthisElementClass || !iNaddTo || !iNthisElObject || !iNthisElObject['body']['status']['copiable']  ) { return; }

      const el            = iNthisElObject,
            addTo         = (iNaddTo === 'post') ? 'post' : 'pre',
            newInIdObject = {},
            parentBlock   = {},
            thisElClass   = iNthisElementClass;

      let   copable       = el['body']['status']['copiable'],
            newElObject,
            result,
            shortData = {};//(typeof iNshorData === 'object') ? iNshorData : {};

      //copy parent block
        this.copyParentBlockFromElement( el, parentBlock);

      // set copable if not object
        copable = (typeof  copable === 'object') ? copable : {'inid': el['id'], 'id': el['modelid'] };

      // get short data with merge copage
        console.log( 'copy - before -  el', el, JSON.stringify(el) );
        console.log( 'copy - before -  copable, shortData', JSON.stringify(copable), JSON.stringify(shortData) );
        shortData = this.connect.mergeObject(copable, shortData);

      // create object
      //   result      =  new Promise (
      //     async (resolve) => {
      //       // create object && and resolve
      //       newElObject = await thisElClass.create(shortData, parentBlock, newInIdObject);
      //       resolve(newElObject);
      //     }
      //   );

      newElObject = await thisElClass.create(shortData, parentBlock, newInIdObject, true, iNcallback);

      console.log('copy - shortData, newElObject', shortData, newElObject );

      if (!newElObject) {
        // we can not create sub group -> STOP this object
        return this.returnPromiseValue(null);
      }
      const      objRef    = { baseid  : el['modelid'], objid   : newElObject['id'] };

      console.log('copy - objRef', objRef, newInIdObject );

      // check iner id if isset
      // objRef['inid'] = this.safeGetInId(iNshorData['inid'], newElObject['id'], newInIdObject);

      // add to array
      if (addTo === 'post') {
        el['post'].push( objRef );
      } else {
        el['pre'].push( objRef );
      }
      console.log('copy - end' );
    }
  //@> WORK WITH ELEMENT

  //@< FORM SUBMITORS
    async submitForm (iNuserId = null, iNmodelId = null, iNformId = null, iNcallback = null) {
      // update form to firebase
      let uid       = iNuserId || FreeformCommonService.userId,
        callback    = iNcallback,
        modelId     = iNmodelId || FreeformCommonService.formModelId,
        formId      = iNformId || FreeformCommonService.formId,
        err         = false, // default - we have no error
        myUid       = await this.auth.getUserIdByPromise(),
        token       = this.auth.user.token,
        url         = `https://ramman.net/api/service/freeform/submit/${uid}/${modelId}?formId=${formId}&uid=${myUid}&token=${token}`;

      this.http.get(url).subscribe (
        (data) => {

          console.log('submitForm form - url', url);
          console.log('submitForm form - data', data);
          if ( typeof callback === 'function' ) {
            let formData = data;
            if ( !formData || formData['status'] !== 1) {
              // if we have not object -> set result to true -> invoke callback
              err = true;
            }
            if ( typeof callback === 'function' ) {
              // invoke callback
              callback(err, formData, formId);
            }
          }
        }
      );
    }
  //@> FORM SUBMITORS

  //@< WORK with element parent

    copyParentBlockFromElement ( iNel, iNparentBlock ) {
      //@disc copy parent options from element options to passed obejct iNparentBlock
      const options = iNel['options'];
      let   counter = 0;
      for (const key in options)  {
        if ( key.indexOf('p-') !== -1 ) {
          // if this parent key -> copy to parent block
          iNparentBlock[key] = options[key];
          counter++;
        }
      }
      return counter;
    }
  //@> WORK with element parent

  async syncFormMap (iNuid, iNformModelId, iNformId, iNmap): Promise<any> {
    const map    = iNmap,
        update    = {},
        pathToDoc = `freeform/${iNuid}/model/${iNformModelId}/form/${iNformId}`;

        update[`map`] = map;
    return this.firestore.firestore.doc( pathToDoc ).update( update);
  }

  async createFreeformNotFieldObject (iNuid, iNformModelId, iNformId, iNobject, iNmodelId, iNobjId, iNtype): Promise<boolean> {
      let folder    = null,
          update    = {},
          pathToDoc = `freeform/${iNuid}/model/${iNformModelId}/form/${iNformId}`;

      switch (iNtype) {
        case 'page':
          folder = 'pages';
        break;

        case 'row':
          folder = 'rows';
        break;

        case 'group':
          folder = 'groups';
        break;

      }
      if (folder) {
        update[ `${folder}.${iNmodelId}.objects.${iNobjId}` ] = iNobject;
        const result = this.connect.getValueFromObjectByPath(`${folder}.${iNmodelId}.objects.${iNobjId}`, this.freeform );

        try {
          const thisFirestore = await this.firestore.firestore.doc( pathToDoc ).update( JSON.parse(JSON.stringify(update)) );
          return this.returnPromiseValue (true ) as Promise<boolean>;
        } catch (e) {
          return this.returnPromiseValue (false ) as Promise<boolean>;
        }
      } else {
        return this.returnPromiseValue (false) as Promise<boolean>;
      }
    }


    //**LATER DELETE
    copyFormModel (iNuserId, iNmodelId, iNnewUserId, iNnewModelId, iNcallback) {
      // update form to firebase
      let uid       = iNuserId,
          callback  = iNcallback,
          modelId   =  iNmodelId,
          err       = false, // default - we have no error
          pathToDoc     = `freeform/${iNuserId}/model/${iNmodelId}`,
          newPathToDoc  = `freeform/${iNnewUserId}/model/${iNnewModelId}`;

      this.firestore.firestore.doc(pathToDoc).get().then(
        (data) => {
          if ( typeof callback === 'function' ) {
            const formData = data.data();
            if ( !formData ) {
              // if we have not object -> set result to true -> invoke callback
              err = true;
            }
            if (formData) {
              // copy form
              this.firestore.firestore.doc(newPathToDoc).set(formData);
            }

            if ( typeof callback === 'function' ) {
              // invoke callback
              callback(err, formData);
            }
          }
        }
      ).catch(
        (d) => {
          // if we have error-> set result to true -> invoke callback
          err = true;
          if ( typeof callback === 'function' ) {
            callback(err, null);
          }

        }
      );
    }

  //**LATER DELETE

    createModelElement (iNuserId, iNmodelId, iNid, iNdata) {
      // update form to firebase
      const uid         = iNuserId,
          modelId     =  iNmodelId,
          err         = false, // default - we have no error
          pathToDoc   = `freeform/${uid}/model/${modelId}/element/${iNid}`; // /form/${iNformId} /element; // /form/${iNnewFormId}/element/
      console.log('form - pathToDoc', pathToDoc);
        this.firestore.firestore.doc( pathToDoc ).set( iNdata );
    }

    copyModelElements (iNuserId, iNmodelId, iNnewUserId, iNnewModelId, iNcallback) {
      // update form to firebase
      let uid       = iNuserId,
        callback  = iNcallback,
        modelId   =  iNmodelId,
        err       = false, // default - we have no error
        pathToDoc     = `freeform/${iNuserId}/model/${iNmodelId}`, // /form/${iNformId} /element
        newPathToDoc  = `freeform/${iNnewUserId}/model/${iNnewModelId}/element`; // /form/${iNnewFormId}/element/

      this.firestore.firestore.doc(pathToDoc).get().then (
        (data) => {
          if ( typeof callback === 'function' ) {
            const formData = data.data();
            if ( !formData ) {
              // if we have not object -> set result to true -> invoke callback
              err = true;
            }
            if (formData) {
              console.log('copyModelElements - formData', formData );
              //
                {
                  // copy pages
                  const folder    = 'pages',
                      prefixModel = 'm-p-',
                      objs        = formData[ folder ];
                  console.log('copyModelElements - folder, objs', folder, objs );
                  for (const objId of Object.keys(objs) ) {
                    const object      = objs[objId]['base'],
                        dbId        = prefixModel + object[ 'modelid' ],
                        dbPath      = `${newPathToDoc}/${dbId}`;
                    console.log('copyModelElements - dbPath, page', dbPath, object );

                    this.firestore.firestore.doc( dbPath ).set( object );
                  }
                }

              //
                {
                  // copy rows
                  const folder    = 'rows',
                      prefixModel = 'm-r-',
                      objs        = formData[ folder ];
                  for (const objId of Object.keys(objs) ) {
                    const object      = objs[objId]['base'],
                        dbId        = prefixModel + object[ 'modelid' ],
                        dbPath      = `${newPathToDoc}/${dbId}`;

                    this.firestore.firestore.doc( dbPath ).set( object );
                  }
                }

              //
                {
                  // copy groups
                  const folder    = 'groups',
                    prefixModel = 'm-g-',
                    objs        = formData[ folder ];
                  for (const objId of Object.keys(objs) ) {
                    const object      = objs[objId]['base'],
                        dbId        = prefixModel + object[ 'modelid' ],
                        dbPath      = `${newPathToDoc}/${dbId}`;

                    this.firestore.firestore.doc( dbPath ).set( object );
                  }
                }

              //
              {
                // copy fields
                const folder    = 'fields',
                  prefixModel = 'm-f-',
                  objs        = formData[ folder ];
                for (const objId of Object.keys(objs) ) {
                  const object      = objs[objId]['base'],
                      dbId        = prefixModel + object[ 'modelid' ],
                      dbPath      = `${newPathToDoc}/${dbId}`;

                  this.firestore.firestore.doc( dbPath ).set( object );
                }
              }

            }

            if ( typeof callback === 'function' ) {
              // invoke callback
              callback(err, formData);
            }
          }
        }
      ).catch(
        (d) => {
          // if we have error-> set result to true -> invoke callback
          err = true;
          if ( typeof callback === 'function' ) {
            callback(err, null);
          }

        }
      );
    }


  //**LATER DELETE
  copyFormModelAccessList (iNuserId, iNmodelId, iNnewUserId, iNnewModelId, iNcallback) {
    // update form to firebase
    let uid       = iNuserId,
      callback  = iNcallback,
      modelId   =  iNmodelId,
      err       = false, // default - we have no error
      pathToDoc     = `freeform/${iNuserId}/model/${iNmodelId}/accessList/lw3Do9CFMdy4syMG6HmH/user/bac255e1-6a59-4181-bfb9-61139e38630e`,
      newPathToDoc  = `freeform/${iNnewUserId}/model/${iNnewModelId}/accessList/lw3Do9CFMdy4syMG6HmH/user/bac255e1-6a59-4181-bfb9-61139e38630e`;

    this.firestore.firestore.doc(pathToDoc).get().then(
      (data) => {
        if ( typeof callback === 'function' ) {
          const formData = data.data();
          if ( !formData ) {
            // if we have not object -> set result to true -> invoke callback
            err = true;
          }

          if (formData) {
            // copy form
            this.firestore.firestore.doc(newPathToDoc).set(formData);
          }

          if ( typeof callback === 'function' ) {
            // invoke callback
            callback(err, formData);
          }
        }
      }
    ).catch(
      (d) => {
        // if we have error-> set result to true -> invoke callback
        err = true;
        if ( typeof callback === 'function' ) {
          callback(err, null);
        }

      }
    );
  }


  copyFormModelFieldModel (iNuserId, iNmodelId, iNfieldModel, iNnewUserId, iNnewModelId, iNfieldNewModel, iNcallback) {
    console.log (
      'copyFormModelFieldModel 1',
      iNuserId, iNmodelId, iNfieldModel, iNnewUserId, iNnewModelId, iNfieldNewModel
    );
    // update form to firebase
    let uid       = iNuserId,
      callback  = iNcallback,
      modelId   =  iNmodelId,
      err       = false, // default - we have no error
      pathToDoc     = `freeform/${iNuserId}/model/${iNmodelId}/element/${iNfieldModel}`,
      newPathToDoc  = `freeform/${iNnewUserId}/model/${iNnewModelId}/element/${iNfieldNewModel}`;

    this.firestore.firestore.doc(pathToDoc).get().then(
      (data) => {
        console.log('copyFormModelFieldModel data', data );
        if ( typeof callback === 'function' ) {
          const formData = data.data();
          console.log('copyFormModelFieldModel 3 formData', formData );
          if ( !formData ) {
            // if we have not object -> set result to true -> invoke callback
            err = true;
          }

          if (formData) {
            // copy form
            this.firestore.firestore.doc(newPathToDoc).set(formData);
          }

          if ( typeof callback === 'function' ) {
            // invoke callback
            callback(err, formData);
          }
        }
      }
    ).catch(
      (d) => {
        // if we have error-> set result to true -> invoke callback
        err = true;
        if ( typeof callback === 'function' ) {
          callback(err, null);
        }

      }
    );
  }


  //**LATER DELETE
  copyFormModelAccessListForObject (iNuserId, iNmodelId, iNnewUserId, iNnewModelId, iNcallback) {
    // update form to firebase
    let uid       = iNuserId,
      callback  = iNcallback,
      modelId   =  iNmodelId,
      err       = false, // default - we have no error
      pathToDoc     = `freeform/${iNuserId}/model/${iNmodelId}/accessListForObject/vJKW9GtAfIlBcNzmarQy/user/bac255e1-6a59-4181-bfb9-61139e38630e`,
      newPathToDoc  = `freeform/${iNnewUserId}/model/${iNnewModelId}/accessListForObject/vJKW9GtAfIlBcNzmarQy/user/bac255e1-6a59-4181-bfb9-61139e38630e`;

    this.firestore.firestore.doc(pathToDoc).get().then(
      (data) => {
        if ( typeof callback === 'function' ) {
          const formData = data.data();
          if ( !formData ) {
            // if we have not object -> set result to true -> invoke callback
            err = true;
          }
          if (formData) {
            // copy form
            this.firestore.firestore.doc(newPathToDoc).set(formData);
          }

          if ( typeof callback === 'function' ) {
            // invoke callback
            callback(err, formData);
          }
        }
      }
    ).catch(
      (d) => {
        // if we have error-> set result to true -> invoke callback
        err = true;
        if ( typeof callback === 'function' ) {
          callback(err, null);
        }

      }
    );
  }

  public sendStatusOfFreefomObjectToDb (
    iNobjType: string,
    iNobjModelId,
    iNobjId,
    iNstatus,
    iNuserId = FreeformCommonService.userId,
    iNformModelId = FreeformCommonService.formModelId,
    iNformId = FreeformCommonService.formId
  ): boolean {
    // send freeform object (field, none-field) status for save to firestore db
    const uid           = iNuserId,
        formModelId   = iNformModelId,
        formId        = iNformId,
        objType       = iNobjType,
        objId         = iNobjId,
        objModelId    = iNobjModelId,
        status        = (iNstatus) ? true : false;

    switch (objType) {
      case 'collection':
        // collection it is field -> update field status
        return this.sendElementStatusToDb(objModelId, objId, status, uid, formModelId, formId);
      // break;

      case 'field':
        // update field status
        return this.sendElementStatusToDb(objModelId, objId, status, uid, formModelId, formId);
      // break;

      default:
        // not field (row, page, group) -> update
        return this.sendNonFieldStatusToDb(objType, objModelId, objId, status, uid, formModelId, formId);
      // break;
    }
  }

    private sendNonFieldStatusToDb (
      iNobjType: string,
      iNobjModelId,
      iNobjId,
      iNstatus,
      iNuserId = FreeformCommonService.userId,
      iNformModelId = FreeformCommonService.formModelId,
      iNformId = FreeformCommonService.formId
    ): boolean {
      // send field status for save to firestore db
      let uid           = iNuserId,
          formModelId   = iNformModelId,
          formId        = iNformId,
          objType       = iNobjType,
          objId         = iNobjId,
          objModelId    = iNobjModelId,
          status        = (iNstatus) ? true : false,
          update        = {},
          folder        = null,
          dbId          = this.getDbIdByIdAndType (objType, 'object', objId),
          pathToEl    = `freeform/${uid}/model/${formModelId}/form/${formId}/element/${dbId}`,
          pathToForm    = `freeform/${uid}/model/${formModelId}/form/${formId}`;


      switch (objType) {
        case 'page':
          folder = 'pages';
          break;

        case 'row':
          folder = 'rows';
          break;

        case 'group':
          folder = 'groups';
        break;
      }

      if ( folder ) {

        if (
          !(
            this.freeform[folder][objModelId] &&
            this.freeform[folder][objModelId]['objects'] &&
            this.freeform[folder][objModelId]['objects'][objId] &&
            this.isSavableObject( this.freeform[folder][objModelId]['objects'][objId] )
          )
        ) {
          // is not savable object -> stop this func
          return false;
        }

        if (
          this.isSimpleForm()
        ) {
          // it is simpleform -> update status to form document
          update[`${folder}.${objModelId}.objects.${objId}.body.status.value`] = status;
          this.firestore.firestore.doc( pathToForm ).update( update);
          console.log('sendNonFieldStatusToDb - pathToForm, update', pathToForm, update);
        } else {
          // it is not simpleform -> update status to element document
          update[`body.status.value`] = status;
          this.firestore.firestore.doc( pathToEl ).update( update);
          console.log('sendNonFieldStatusToDb - pathToEl, update', pathToEl, update);
        }

        // if we have right obj folder
        // update on server
        return true;
      }
      return false;
    }

    private getDbIdByIdAndType (iNtype, iNobjType, iNelId) {
      let elId            = iNelId,
        objType         = iNobjType,
        type            = iNtype,
        dbId            = null;

      switch (type) {
        case 'field':
          dbId = (objType === 'model')  ? ('m-f-' + elId) : ('o-f-' + elId );
          break;
        case 'page':
          dbId = (objType === 'model')  ? ('m-p-' + elId) : ('o-p-' + elId );
          break;
        case 'group':
          dbId = (objType === 'model')  ? ('m-g-' + elId) : ('o-g-' + elId );
          break;
        case 'row':
          dbId = (objType === 'model')  ? ('m-r-' + elId) : ('o-r-' + elId );
          break;
      }
      return dbId;

    }
    private sendElementStatusToDb (iNelModelId, iNelId, iNstatus, iNuserId = FreeformCommonService.userId, iNformModelId = FreeformCommonService.formModelId, iNformId = FreeformCommonService.formId) {
    //**LATER add save by elType, moved here get folder name
    // send field status for save to firestore db
      const uid           = iNuserId,
          formModelId   = iNformModelId,
          formId        = iNformId,
          elId          = iNelId,
          elModelId     = iNelModelId,
          status        = (iNstatus) ? true : false,
          update        = {},
          dbId          = this.getDbIdByIdAndType ('field', 'object', elId),
          pathToElement = `freeform/${uid}/model/${formModelId}/form/${formId}/element/${dbId}`, // element/${elModelId}/
          pathToForm = `freeform/${uid}/model/${formModelId}/form/${formId}`;
      if (
        !(
          this.isSavableForm() &&
          this.freeform['fields'] &&
          this.freeform['fields'][elModelId]['objects'] &&
          this.freeform['fields'][elModelId]['objects'][elId] &&
          this.isSavableObject( this.freeform['fields'][elModelId]['objects'][elId] )
        )
      ) {
        // is not savable object -> stop this func
        return false;
      }

      if (
        this.isSimpleForm()
      ) {
        // it is simpleform -> update status to form document
        update[`fields.${elModelId}.objects.${elId}.body.status.value`] = status;
        this.firestore.firestore.doc( pathToForm ).update( update);
        console.log('sendElementStatusToDb - pathToForm, update', pathToForm, update);
      } else {
        // it is not simpleform -> update status to element document
        update[`body.status.value`] = status;
        this.firestore.firestore.doc( pathToElement ).update( update).then(
          (s) => {
            console.log('sendElementStatusToDb - pathToElement, update e', s, pathToElement, update);

          }
        ).catch(
          (e) => {
            console.log('sendElementStatusToDb - pathToElement, update e', e, pathToElement, update);
          }
        );
        console.log('sendElementStatusToDb - pathToElement, update', pathToElement, update);
      }


      return true;
    }

  public isSavableForm () {
    //@ disc - all form is not savable by default
    if (
      this.freeform['options'] &&
      this.freeform['options']['savable']
    ) {
      // this form not savable
      return true;
    }
    return false;
  }

  public isSavableObject (iNobject) {
    //@ disc - all object (not form) is savable by default
    if (
      this.isSavableForm() &&
      (
        ( iNobject['options'] && ( iNobject['options']['savable'] !== false ) ) ||
        ( !iNobject['options'] )
      )
    ) {
      // this form not savable
      return true;
    }
    return false;
  }


  public sendElementValueToDb (iNelementModelId, iNelId, iNvalue, iNuserId = FreeformCommonService.userId, iNformModelId = FreeformCommonService.formModelId, iNformId = FreeformCommonService.formId) {
    // let uid           = iNuserId,
    //   formModelId   = iNformModelId,
    //   formId        = iNformId,
    //   fieldId       = iNelId,
    //   fieldModelId  = iNelementModelId,
    //   value         = iNvalue,
    //   update        = {},
    //   pathToDoc     = `freeform/${uid}/model/${formModelId}/form/${formId}/element/${fieldModelId}/object/${fieldId}`;
    //
    // if (
    //   !(
    //     this.freeform['fields'] &&
    //     this.freeform['fields'][fieldModelId]['objects'] &&
    //     this.freeform['fields'][fieldModelId]['objects'][fieldId] &&
    //     this.isSavableObject( this.freeform['fields'][fieldModelId]['objects'][fieldId] )
    //   )
    // ) {
    //   // is not savable object -> stop this func
    //   return false;
    // }
    // update[`body.value`] = value;
    // console.log(' sendElementValueToDb - pathToDoc', pathToDoc, update);
    // // this.firestore.firestore.doc( pathToDoc ).update( update);

    return this.sendElementValueByPathToDb('field', iNelementModelId, iNelId, 'value', iNvalue, iNuserId, iNformModelId, iNformId);
  }

  public sendElementValueByPathToDb (iNelType, iNelementModelId: string, iNelId: string, iNpath: string, iNvalue: any, iNuserId = FreeformCommonService.userId, iNformModelId = FreeformCommonService.formModelId, iNformId = FreeformCommonService.formId) {
    const uid           = iNuserId,
      formModelId   = iNformModelId,
      formId        = iNformId,
      elId          = iNelId,
      dbId          = this.getDbIdByIdAndType (iNelType, 'object', elId),
      elModelId     = iNelementModelId,
      path          = iNpath,
      value         = iNvalue,
      update        = {},
      pathToDoc     = `freeform/${uid}/model/${formModelId}/form/${formId}/element/${dbId}`; // ${elModelId}/object/

    //**LATE add elType recoginiser
    if (
      !(
        this.freeform['fields'] &&
        this.freeform['fields'][elModelId]['objects'] &&
        this.freeform['fields'][elModelId]['objects'][elId] &&
        this.isSavableObject( this.freeform['fields'][elModelId]['objects'][elId] )
      )
    ) {
      // is not savable object -> stop this func
      return false;
    }
    update[`body.${path}`] = value;
    console.log(' sendElementValueByPathToDb - pathToDoc', pathToDoc, update);
    this.firestore.firestore.doc( pathToDoc ).update( update).then(
      (s) => {
        console.log('sendElementValueByPathToDb - pathToElement, update s', s, pathToDoc, update);

      }
    ).catch(
      (e) => {
        console.log('sendElementValueByPathToDb - pathToElement, update e', e, pathToDoc, update);
      }
    );

    return true;
  }


    // updateForm (iNdata, iNuserId, iNmodelId, iNformId )  {
    //   // update form to firebase
    //   let uid       = iNuserId,
    //       formData      = iNdata,
    //       modelId   = iNmodelId,
    //       formId    = iNformId,
    //       pathToDoc = `freeform/${uid}/model/${modelId}/form/${formData}`;
    //
    //   this.firestore.firestore.doc( pathToDoc ).set(data);
    // }

    private async createFieldFromModel (iNuserId, iNformModelId, iNformId, iNfieldModelId, iNfieldId): Promise<object> {
    //@disable
      const uid           = iNuserId,
          formModelId   = iNformModelId,
          formId        = iNformId,
          fieldId       = iNfieldId,
          fieldModelId  = iNfieldModelId,
          result        = { 'err': true, 'fieldId': fieldId, 'field': null },
          pathToDoc     = `freeform/${uid}/model/${formModelId}/form/${formId}/element/${fieldModelId}`;

        return new Promise(
          async (resolve, reject) => {
            try {
              const model       = await this.firestore.firestore.doc( pathToDoc ).get(),
                  modelData   = model.data(),
                  pathToField = `freeform/${uid}/model/${formModelId}/form/${formId}/element/${fieldModelId}/obj/${fieldId}`;
              // create field
              if ( modelData ) {
                // we got model -> create field object from model
                try {
                  await this.firestore.firestore.doc( pathToField ).set( modelData );
                  resolve(modelData);
                } catch (e) {
                  // not access for create field object
                  resolve(null);
                }

              }

            } catch (e) {
              // throw new Error("Not access");
              resolve(null);
            }
          }
        );
    }


    public async getElementFromFormObject (iNelType, iNobjType, iNuserId, iNformModelId, iNformId, iNelId ): Promise<object> {
      // create field to firebase
      const uid               = iNuserId,
            formModelId       = iNformModelId,
            formId            = iNformId,
            elId              = iNelId,
            elType            = iNelType,
            objType           = iNobjType,
            dbId              = this.getDbIdByIdAndType (elType, objType, elId),
            pathToDoc         = `freeform/${uid}/model/${formModelId}/form/${formId}/element/${elId}`;

      return new Promise (
        async (resolve, reject) => {
          try {
            const data  = await this.firestore.firestore.doc( pathToDoc ).get(),
                field = data.data();

            // we have access to this field
            if ( field ) {
              // if we have field -> callback
              resolve( field );
              return;
            }
            // we canot field
            resolve( null );
          } catch (e) {
            // we have not access to this field
            resolve(null);
          }
        }
      );
    }

    public async getFieldObjectFromDb (iNuserId, iNformModelId, iNformId, iNfieldModelId, iNfieldId ): Promise<object> {
      //@disc get field object from firebase
      const uid           = iNuserId,
          formModelId   = iNformModelId,
          formId        = iNformId,
          fieldId       = iNfieldId,
          fieldModelId  = iNfieldModelId,
          pathToDoc     = `freeform/${uid}/model/${formModelId}/form/${formId}/element/${fieldId}`; // ${fieldModelId}/object/

      return new Promise (
        async (resolve, reject) => {
            try {
              const data  = await this.firestore.firestore.doc( pathToDoc ).get(),
                  field = data.data();

              if ( field ) {
                // if we have field -> return field
                resolve(field);
                return;
              }
              // resolve
              resolve(null);
            } catch (e) {
              // we have not access to this field
              resolve(null);
            }
         }
      );
    }

    public async createElementForSimpleForm (iNelType, iNdata, iNuserId, iNmodelId, iNformId, iNelModelId, iNelId ): Promise<boolean>  {
      //@LATER ADD DB BY SERVER REQUEST
      // create field to firebase
      let uid           = iNuserId,
          data          = iNdata,
          modelId       = iNmodelId,
          formId        = iNformId,
          elId          = iNelId,
          elType        = iNelType,
          elModelId     = iNelModelId,
          dbId          = this.getDbIdByIdAndType (elType, 'object', elId),
          pathToDoc     = `freeform/${uid}/model/${modelId}/form/${formId}`,
          result        = false,
          update        = {};
          // update block for simple form
          update[ `fields.${elModelId}.objects.${dbId}` ] = data;

        try {
          await this.firestore.firestore.doc( pathToDoc ).update(update);
          result = true;
        } catch (e) {
          result = false;
        }
        return new Promise<boolean> (
          (resolve, reject) => {
            resolve(result);
          }
        );
    }

    public async createElement (iNelType, iNdata, iNuserId, iNmodelId, iNformId, iNelModelId, iNelId ): Promise<boolean>  {
      //@LATER ADD DB BY SERVER REQUEST
      // create field for simple form OR full funcitonalite seperate fields in firestore db
      if ( this.isSimpleForm() ) {
        // it is simple form -> create fields in this simple form
        return this.createElementForSimpleForm(iNelType, iNdata, iNuserId, iNmodelId, iNformId, iNelModelId, iNelId);
      } else {
        // it is not simple form -> create full functionality seperate fields
        return this.createElementForNotSimpleForm(iNelType, iNdata, iNuserId, iNmodelId, iNformId, iNelId);
      }
    }

    public async createElementForNotSimpleForm (iNelType, iNdata, iNuserId, iNmodelId, iNformId, iNelId ): Promise<boolean>  {
      //@LATER ADD DB BY SERVER REQUEST
      // create field to firebase
      let uid           = iNuserId,
          data          = iNdata,
          modelId       = iNmodelId,
          formId        = iNformId,
          elId          = iNelId,
          elType        = iNelType,
          dbId          = this.getDbIdByIdAndType (elType, 'object', elId),
          pathToDoc     = `freeform/${uid}/model/${modelId}/form/${formId}/element/${dbId}`, // ${elModelId}/object/
          result        = false;

      try {
        await this.firestore.firestore.doc( pathToDoc ).set(data);
        result = true;
      } catch (e) {
        result = false;
      }
      return new Promise<boolean> (
        (resolve, reject) => {
          resolve(result);
        }
      );
    }

    public returnPromiseValue (iNvalue) {
      //@disc - return promise value
      const val = iNvalue;
      return new Promise<any>(
        (resolve) => {
          resolve(val);
        }
      );
    }

    public async updateField (iNdata, iNuserId, iNmodelId, iNformId, iNfieldId ): Promise<boolean>  {
      // update field to firebase
      let uid       = iNuserId,
          data      = iNdata,
          modelId   = iNmodelId,
          formId    = iNformId,
          fieldId   = iNfieldId,
          pathToDoc = `freeform/${uid}/model/${modelId}/form/${formId}/element/${fieldId}`,
          result    = false;

        try {
          await this.firestore.firestore.doc( pathToDoc ).update( data );
          result = true;
        } catch (e) {
          result = false;
        }

        return new Promise<boolean> (
          (resolve, reject) => {
            resolve(result);
          }
        );
    }
  //@> FIRESTORE



  ngOnInit () {
  }


  public sortObjectByWeight (iNarray) {
    // desc order by weight
    return iNarray.sort((obj1, obj2) => {
      obj1.weight = (obj1.weight) ? obj1.weight : 1;
      obj2.weight = (obj2.weight) ? obj2.weight : 1;

      return  obj2.weight - obj1.weight;
    });
  }

  public  checkForArrOfObject (iNrulesOfObject) {
    let forBlock        = iNrulesOfObject['for'];
    const statusByWeight  = {};
    const statusByGroup   = {};

    let lastWeight  = null,
      lastGroup   = null,
      counter     = 0;


    // sort this object before start iteration by weight and group (need for right result)
    iNrulesOfObject['for'] = forBlock = this.sortFORelObject(forBlock);

    for (const forEl of forBlock) {
      // increase counter Need for recoginize last operation
      counter++;

      const weight = forEl['weight'];
      const group = forEl['group'];


      // if this first iteration -> set initial lastWeight && lastGroup
      if (lastWeight === null) {
        lastWeight  = weight;
        lastGroup   = group;
      }

      if (lastWeight === weight ) {
        // if this weight is the same previous weight ->

        if (lastGroup !== group ) {
          if ( statusByWeight[lastWeight] === true ) {
            // if this new group but in the same weigth but same group was success -> we SKIP <- DONT CHECK
            continue;
          } else {
            // if this new group but in the same weigth but same group was false -> we continue <- DONT CHECK

          }
        } else if (statusByWeight[group] === false) {
          // if this the same group but at less one operation in this group was false -> continue;
          continue;
        }

      } else if ( lastWeight !== weight && statusByWeight[lastWeight] !== true ) {
        // if this new weight but last weight is false -> return false;
        return false;
        // break;
      }

      // if this new grou and thes previous group was false -> we check next
      const result = this.for_checkForElOperation (forEl);

      // set result for group and weight
      statusByWeight[weight]  = statusByWeight[group] = result;

      if (forBlock.length === counter && !result) {
        // if this was last operation and result was false => output false (need only for single array)
        return false;
      }

      // set last group and last weight
      lastWeight  = weight;
      lastGroup   = group;

    }

    return true;
  }

  public for_dependentStartByObject (iNobject) {
    if (typeof iNobject !== 'object') { return; }

    const rules       = iNobject['body']['rules'];
    const inid        = iNobject['id'];
    const dependent   = rules['dependent'];
    if (!Array.isArray(dependent)) { return false; }

    for (const dependentEl of dependent) {
      if (!dependentEl['sourse_in_id']) { dependentEl['sourse_in_id'] = dependentEl['in_id']; }
      dependentEl['in_id'] = inid;

      //
      const obj = this.getFreefomObjectByInId(dependentEl['sourse_in_id']);
      if ( this.for_checkForElOperation(dependentEl)) { //  && !iNobject['body']['status']['hide']
        // if this rule === true -> check full for block
        if (obj) {
          // check full for block
          this.for_analyseForBlockByObject(obj);
        }
      } else if (!obj['body']['status']['hide']) {
        // if this el is not hide yet we must hide this <- check false
        obj['body']['status']['hide'] = true;
      }
    }

  }

  public for_checkForElOperation (iNforEl): boolean {
    //
    const type    = iNforEl['type'];
    const elem    = this.getFreefomObjectByInId(iNforEl['in_id']);
    const val     = iNforEl['value'];

    let result  = false;
    switch (type) {
      //@< EQUALORMORE OR LESSORMORE
      case 'isMoreOrEqual':
        // if this element's value is more or euial  than value and is not exist
        if (
          elem && (
            (typeof val === 'string' && val >= (elem['body']['value'] + '')) ||
            (typeof val === 'number' && val >= ( parseInt(elem['body']['value']) ) )
          )
        ) {
          result =  true;
        }
        break;

      case 'isLessOrEqual':
        // if this element's value is less or euial  than value and is not exist
        if (
          elem && (
            (typeof val === 'string' && val <= (elem['body']['value'] + '')) ||
            (typeof val === 'number' && val <= ( parseInt(elem['body']['value']) ) )
          )
        ) {
          result =  true;
        }
        break;
      //@> EQUALORMORE OR LESSORMORE

      //@< MORE OR LESS
      case 'isMore':
        // if this element's value is more than value and is not exist
        if (
          elem && (
            (typeof val === 'string' && val > (elem['body']['value'] + '')) ||
            (typeof val === 'number' && val > ( parseInt(elem['body']['value']) ) )
          )
        ) {
          result =  true;
        }
        break;

      case 'isLess':
        // if this element's value is less than value and is not exist
        if (
          elem && (
            (typeof val === 'string' && val < (elem['body']['value'] + '')) ||
            (typeof val === 'number' && val < ( parseInt(elem['body']['value']) ) )
          )
        ) {
          result =  true;
        }
        break;
      //@> MORE OR LESS

      //@< EQUIL
      case 'isEqual':
        // if this element's value is euqilt and is not exist
        if (
          elem  && !elem['body']['status']['hide'] && (
            (typeof val === 'string' && val === (elem['body']['value'] + '') ) ||
            (typeof val === 'number' && val === ( parseInt(elem['body']['value']) ) )
          )
        ) {
          result =  true;
        }
        break;

      case '!isEqual':
        // if this element's value is not euqil and is not exist
        if (
          elem && (
            (typeof val === 'string' && val !== (elem['body']['value'] + '') ) ||
            (typeof val === 'number' && val !== ( parseInt(elem['body']['value']) ) )
          )
        ) {
          result =  true;
        }
        break;
      //@> EQUIL


      //@< ANYOF
      case 'isAnyOf':
        // if this element's value is in array and is not exist
        if (
          elem && (
            (Array.isArray(val) && val.indexOf(elem['body']['value']) !== -1) ||
            (Array.isArray(val) && val.indexOf(parseInt(elem['body']['value'])) !== -1) // **LATER DELET**
          )
        ) {
          result =  true;
        }
        break;

      case '!isAnyOf':
        // if this element's value is not in array and is not exist
        if (
          elem && (
            (Array.isArray(val) && val.indexOf(elem['body']['value']) === -1) &&
            (Array.isArray(val) && val.indexOf(parseInt(elem['body']['value'])) === -1) // **LATER DELET**
          )
        ) {
          result =  true;
        }
        break;
      //@> ANYOF


      //@< FOCUS
      case 'isFocus':
        // if this element's value is in focus now and is not exist
        if (
          elem &&
          elem['body']['status']['focus'] === true
        ) {
          result =  true;
        }
        break;
      case '!isFocus':
        // if this element's value is not in focus now and is not exist
        if (
          elem &&
          elem['body']['status']['focus'] !== true
        ) {
          result =  true;
        }
        break;
      //@> FOCUS

      //@< TOUCHED
      case 'isTouched':
        // if this element's value is in focus now and is not exist
        if (
          elem &&
          elem['body']['status']['touched'] === true
        ) {
          result =  true;
        }
        break;
      case '!isTouched':
        // if this element's value is not in focus now and is not exist
        if (
          elem &&
          elem['body']['status']['touched'] !== true
        ) {
          result =  true;
        }
        break;

      case 'isUntouched':
        // if this element's value is not in focus now and is not exist
        if (
          elem &&
          elem['body']['status']['untouched'] === true
        ) {
          result =  true;
        }
        break;
      case '!isUntouched':
        // if this element's value is not in focus now and is not exist
        if (
          elem &&
          elem['body']['status']['untouched'] !== true
        ) {
          result =  true;
        }
        break;
      //@> TOUCHED

      //@< EXIST
      case '!isExist':
        // if this elem is not exist
        if (!elem) {
          result =  true;
        }
        break;

      case 'isExist':
        // if this elem is exist
        if (elem) {
          result =  true;
        }
        break;
      //@> EXIST

      //@< ACTIVE
      case '!active':
        // if this elem not active (not value OR value is false)
        if (elem && elem['body']['status']['value'] !== true) {
          result =  true;
        }
        break;

      default:
        // 'active' - if this elem is active (has value)
        if (elem && elem['body']['status']['value'] !== false) {
          result =  true;
        }
        break;
      //@> ACTIVE
    }
    return result;
  }

  public for_analyseForBlockByObject (iNobject): boolean {
    const rules       = iNobject['body']['rules'];
    const inid        = iNobject['id'];
    const forBlock    = rules['for'];

    if (!Array.isArray(forBlock) ) { return false; }

    // default true
    const result      = this.checkForArrOfObject (rules); // true;

    if ( result ) {
      // show this element <-
      iNobject['body']['status']['hide'] = false;
    } else {
      // hide this element <-
      iNobject['body']['status']['hide'] = true;
    }
    // output result
    return result;

  }

  public sortFORelObject (iNarray) {
    // desc order by weight
    return iNarray.sort((obj1, obj2) => {
      obj1.weight           = ((obj1.weight) ? obj1.weight : 1);
      obj1.order            = ((obj1.order) ? obj1.order : 1);
      const commonWeightObj1  = (obj1.weight * 1000) + obj1.order;

      obj2.weight           = ((obj2.weight) ? obj2.weight : 1);
      obj2.order            = ((obj2.order) ? obj2.order : 1);
      const commonWeightObj2  = (obj2.weight * 1000) + obj2.order;

      let groupWeightObj = 0;
      if (obj1.group < obj2.group) { groupWeightObj = -1; }
      if (obj1.group > obj2.group) { groupWeightObj = 1; }
      groupWeightObj *= 100;

      return  commonWeightObj2 - commonWeightObj1 + groupWeightObj;
    });
  }

  //NOT OPTIMISE FUNC
  public delMyIdFromAllDependent (iNinId: string): {} {
    // get model of this
    const freeform   = this.freeform;

    // categories which search
    const search     = [ 'pages', 'groups', 'rows', 'fields' ];

    for ( const type of search ) {
      // search in this cateogry
      for (const modelid of Object.keys( freeform[type] ) ) {
        //search in this categories' models if this model has objects (created object by this model)
        if (!freeform[type][modelid]['objects']) { continue; }

        for (const objid of Object.keys( freeform[type][modelid]['objects'] ) ) {
          // search in this models' objects
          const obj = freeform[type][modelid]['objects'][objid];
          // del myid from dependent from all
          this.delDependent( iNinId, obj );

        }
      }
    }
    return null;
  }

  public scanRulesOfObject (iNojbect) {
    if (
      typeof iNojbect === 'object' &&
      typeof iNojbect['body']['rules'] === 'object' &&
      Array.isArray(iNojbect['body']['rules']['for'])
    ) {
      const inid      = iNojbect['id'];
      const rules     = iNojbect['body']['rules'];
      const forArray  = rules['for'];

      if ( !Array.isArray(forArray) || forArray.length < 1) {
        return;
      } else {
      }

      // hide this element
      iNojbect['body']['status']['hide'] = true;

      // create dependent
      this.addDependentFromForArray(forArray, inid );
    }
  }

  //@<FOR
  private setForByObject (iNfor, iNobject) {
    const inid = iNobject['id'];

    // create rule block if not
    this.createRuleBlockIfNot(iNobject);

    // del dependent my id from other boejct
    this.delMyIdFromAllDependent (inid);

    // clear this for block (replace all new for block)
    iNobject['body']['rules']['for'] = iNfor;

    // add dependents from new array
    this.addDependentFromForArray (iNfor, inid);
  }

  private delDependentByForFromObject (iNobject) {
    const inid = iNobject['id'];
    if (
      !this.createRuleBlockIfNot(iNobject) &&
      Array.isArray(iNobject['body']['rules']['for']) &&
      iNobject['body']['rules']['for'].length > 0
    ) {
      const forBlock = iNobject['body']['rules']['for'];
      // обходим и удаляем все зависимости
      for ( const thisEl of forBlock ) {
        // получить объект от которого мы зависим
        const my_inid = thisEl.inid;
        const my_obj  = this.getFreefomObjectByInId(my_inid);

        // удалить из объекта зависимость от нас
        this.delDependent(inid, my_obj );
      }
    }
  }

  private createRuleBlockIfNot (iNobject) {
    if (
      typeof iNobject['body']['rules'] !== 'object'
    ) {
      iNobject['body']['rules'] = {};
      return true;
    }
    return false;
  }
  private createDependentBlockIfNot (iNobject) {
    if (
      this.createRuleBlockIfNot(iNobject) &&
      Array.isArray(iNobject['body']['rules']['dependent'])
    ) {
      iNobject['body']['rules']['dependent'] = [];
      return true;
    }
    return false;
  }
  //@>FOR

  private addDependentFromForArray (iNforArray, iNid) {
    for ( const thisEl of iNforArray ) {
      // get object whitch this inid
      let thisObj = this.getFreefomObjectByInId(thisEl.in_id);

      // if this ob
      if (!thisObj) {
        this.createInitialFreeformObject (thisEl['in_id'], thisEl['model_id'], thisEl['obj_type'] );
        thisObj = this.getFreefomObjectByInId(thisEl.in_id);
      }

      // if not skip this step
      if (!thisObj) { continue; }

      // replace this for id to this objectid
      thisEl['in_id'] = iNid;

      //add dependent for this object - iNid
      this.addDependent( thisEl, thisObj );
    }
  }

  private addDependent (iNdependentBlock: _dependentObject, iNojbect): boolean {
    /*
      @input
        iNdependentBlock: dependentBlock
        iNojbect: {}
    */

    // safe create dependent block
    this.createDependentBlockIfNot(iNojbect);


    if ( !Array.isArray(iNojbect['body']['rules']['dependent']) ) { iNojbect['body']['rules']['dependent'] = []; }

    // safe create status block
    if ( typeof(iNojbect['body']['status'] ) !== 'object' ) { iNojbect['body']['status'] = {}; }


    // get dependent array
    const dependent = iNojbect['body']['rules']['dependent'];

    // permission for add dependent ()
    let add = true;

    for ( const thisEl of dependent ) {
      if ( thisEl['in_id'] === iNdependentBlock['in_id'] && iNdependentBlock['in_id']) {
        // if this element isset yet, we not add new element
        add = false;
        // quit out from cycle
        break;
      }
    }

    // add if not isset
    if (add) {
      dependent.push(
        // this.deepcopy(iNdependentBlock)
        iNdependentBlock
      );

    }

    return add;
  }

  private delDependent (iNid: string, iNojbect): number {
    // set initial deleted count to zero
    let deletedCount = 0;

    // if we have dependent and iNid
    if (Array.isArray(iNojbect['body']['dependent']) && typeof iNid === 'string') {
      const dependent = iNojbect['body']['dependent'];

      for ( const k in dependent ) {
        if ( dependent[k].inid === iNid) {
          dependent.splice(k, 1);
          deletedCount++;
        }
      }
    }

    return deletedCount;
  }



  public createInitialFreeformObject (iNid: string, iNbaseId: string, iNtype: string) {
    // random key
    const key = this.connect.getUuid();
    // initial object
    const obj = {
      'id'  : iNid,
      'body': {
        'rules': {}
      },
      'post': [],
      'pre' : []
    };
    switch (iNtype) {
      case 'group':
        // safe create object block + add to each object
        if ( typeof this.freeform['groups'][iNbaseId]['objects'] !== 'object' ) {
          this.freeform['groups'][iNbaseId]['objects'] = {};
        }

        // create initial object
        this.freeform['groups'][iNbaseId]['objects'][key] = obj;
        break;
      case 'row':
        // safe create object block + add to each object
        if ( typeof this.freeform['rows'][iNbaseId]['objects'] !== 'object' ) {
          this.freeform['rows'][iNbaseId]['objects'] = {};
        }

        // create initial object
        this.freeform['rows'][iNbaseId]['objects'][key]   = obj;
        break;
      case 'page':
        // safe create object block + add to each object
        if ( typeof this.freeform['pages'][iNbaseId]['objects'] !== 'object' ) {
          this.freeform['pages'][iNbaseId]['objects'] = {};
        }

        // create initial object
        this.freeform['pages'][iNbaseId]['objects'][key]  = obj;
        break;
      default: // field
        // safe create object block + add to each object
        if ( typeof this.freeform['fields'][iNbaseId]['objects'] !== 'object' ) {
          this.freeform['fields'][iNbaseId]['objects'] = {};
        }

        // create initial object
        this.freeform['fields'][iNbaseId]['objects'][ key ] = obj;
        break;
    }
    return key;
  }

  safeGetInId (iNid: string | null | false, iNkey: string | null | false, iNnewInIdObject): string {
    /*
      @discr
        get inid id from local memory or right new generated inid
     */

    // set for result default value
    let result = iNkey || this.connect.getUuid();

    if ( iNid ) {
      // if we have inid -> we set this inid (with check local copy block)

      if (!iNnewInIdObject) {
        // if dont need generate new inid
        result = iNid;
      } else {
        // if we must generate new inid -> check isset already new id in local memory
        if ( !iNnewInIdObject[iNid] ) {
          // if we not have this inid in local memory -> we set default generate id
          iNnewInIdObject[iNid] = result;
        } else {
          // we have in local memory set result (delete default value for result)
          result = iNnewInIdObject[iNid];
        }
      }
    }
    return result;
  }

  public getFreefomObjectByInId (iNinId: string,  iNsearchObjects: Array<string> | null = null) {
    return this.freeformCommon.getFreefomObjectByInId( iNinId, this.freeform, iNsearchObjects );
  }

  getObjectWithShortData (iNobject, iNshortData, iNfromModel: boolean = false) {
    // for create object with need data if not exist

    //@< replace to new params if they isset
    const object        = iNobject || { 'body': {} },
      bodyOfObject  = object['body'];


    // safe create pre array  (if this not object copy from model) or we have not pre array
    if ( !Array.isArray(iNshortData.pre) || iNfromModel) { object['pre'] = []; }
    // safe create pre array  (if this not object copy from model) or we have not pre array
    if ( !Array.isArray(iNshortData.post) || iNfromModel) { object['post'] = []; }

    //change value of field or create initial value
    if ( typeof iNshortData['value'] === 'string' ) {
      bodyOfObject['value']     = iNshortData['value'];
    } else {
      bodyOfObject['value']     = '';
    }


    if ( typeof iNshortData['name'] === 'string' ) {     bodyOfObject['name']    = iNshortData['name']; }
    // set type if need change
    if ( typeof iNshortData['type'] === 'string' ) {     bodyOfObject['type']    = iNshortData['type']; }
    if ( typeof iNshortData['payload'] === 'object' ) {  bodyOfObject['payload'] = iNshortData['payload']; }
    if ( typeof iNshortData['status'] === 'object' ) {   bodyOfObject['status']  = iNshortData['status']; }
    //@< rules
      if ( typeof iNshortData['rules'] === 'object' ) {
        bodyOfObject['rules']  = iNshortData['rules'];
      } else if (typeof bodyOfObject['rules'] !== 'object' ) {
        // create if not have rule -> probabaly we later must add 'for'
        bodyOfObject['rules'] = {};
      }
      if ( typeof bodyOfObject['rules'] !== 'object' ) {
        // create if not have rule -> probabaly we later must add 'for'
        bodyOfObject['rules'] = {};
      }

      //@< triggers
        if ( typeof iNshortData['triggers'] === 'object' ) {
          bodyOfObject['triggers']    = iNshortData['triggers'];
        } else if (typeof bodyOfObject['triggers'] !== 'object' ) {
          bodyOfObject['triggers'] = {};
        }
      //@> triggers

      // add mask if isset to rules
      if ( iNshortData && Array.isArray(iNshortData['mask']) ) {
        bodyOfObject['rules']['mask']  = iNshortData['mask'];
      }

      // add resolvedSymbols for this field (input) if pass in shortDate
      if ( iNshortData && Array.isArray(iNshortData['resolvedSymbols']) ) {
        bodyOfObject['rules']['resolvedSymbols']  = iNshortData['resolvedSymbols'];
      }


      // add validators (check value after change if(-) clear value) for this field (input) if pass in shortDate
      if ( iNshortData && !Array.isArray(iNshortData['validators']) && typeof iNshortData['validators'] === 'object' ) {
        bodyOfObject['rules']['validators']  = iNshortData['validators'];
      }
    //@> rules

    //@< options
      if ( typeof iNshortData['options'] === 'object' ) {
        bodyOfObject['options']    = iNshortData['options'];
      }
    //@> options

    //@< view
      if ( typeof iNshortData['view'] === 'object' ) {
        bodyOfObject['view']    = iNshortData['view'];
      } else if (typeof bodyOfObject['view'] !== 'object' ) {
        bodyOfObject['view'] = {};
      }

      // add prefix if isset to rules
      if ( iNshortData && iNshortData['prefix'] ) {
        if ( typeof iNshortData['prefix'] !== 'object' ) {
          bodyOfObject['view']['prefix'] = {'type': 'string', 'value' : iNshortData['prefix']};
        } else {
          bodyOfObject['view']['prefix'] = {
            'type': iNshortData['prefix']['type'],
            'value' : iNshortData['prefix']['value']
          };
        }
      }
      // add postfix if isset to rules
      if ( iNshortData && iNshortData['postfix'] ) {
        if ( typeof iNshortData['postfix'] !== 'object' ) {
          bodyOfObject['view']['postfix'] = {'type': 'string', 'value' : iNshortData['postfix']};
        } else {
          bodyOfObject['view']['postfix'] = {
            'type'  : iNshortData['postfix']['type'],
            'value' : iNshortData['postfix']['value']
          };
        }
      }

      // add hint is not exist -> create object
      if ( typeof bodyOfObject['view']['hint'] !== 'object' ) {  bodyOfObject['view']['hint'] = {}; }
      if ( iNshortData && iNshortData['hint'] ) {
        if ( typeof iNshortData['hint'] !== 'object' ) {
          // if in short date is string we add to start hint
          bodyOfObject['view']['hint']['start'] = iNshortData['hint'];
        } else {
          // if in short date is hint as object we add start and end from this
          bodyOfObject['view']['hint'] = {
            'start'   : iNshortData['hint']['start'],
            'end'     : iNshortData['hint']['end']
          };
        }
      }
    //@> view

    if ( typeof iNshortData['status'] === 'object' ) {
      // create if not have rule -> probabaly we later must add 'for'
      bodyOfObject['status'] = iNshortData['status'];
    } else if ( typeof bodyOfObject['status'] !== 'object' ) {
      bodyOfObject['status'] = {};
    }

    // created required array if need or null
    bodyOfObject['status']['required']  =
      ( iNshortData['required'] && Array.isArray(iNshortData['required']) )     ? iNshortData['required']   :
        ( ( bodyOfObject['status']['required'] && Array.isArray(bodyOfObject['status']['required']) ) ? bodyOfObject['status']['required']  : [] );


    if ( iNshortData && Array.isArray(iNshortData['for']) ) {    bodyOfObject['rules']['for']  = iNshortData['for']; }
    if ( typeof iNshortData['permission'] === 'object' ) {    bodyOfObject['permission']  = iNshortData['permission']; }
    if ( typeof iNshortData['actions'] === 'object' ) {    bodyOfObject['actions']  = iNshortData['actions']; }
    if ( typeof iNshortData['helper'] === 'object' ) {    bodyOfObject['helper']  = iNshortData['helper']; }

    //@> replace to new params if they isset
    return object;
  }

  // DELETE THIS ALREADE CREATE NEW FUNCTION
  // getParentOfObjForChildObj ( iNobjId: string, iNmodelId: string, iNtype: string ) {
  //   const result: {objid: string, modelid: string, type: string} = {
  //     objid     : iNobjId,
  //     modelid   : iNmodelId,
  //     type      : iNtype,
  //   };
  //   return result;
  // }

  //@< resolved symbols
    checkSymbolForResolved ( iNsymbol: string, iNresolvedSymbolsArr: Array<string|object> | any) {
      const symb = iNsymbol,
        arr   = iNresolvedSymbolsArr;
      if (
        arr &&
        Array.isArray(arr) &&
        arr.length > 0
      ) {
        for ( const v of arr) {
          const regex = this.connect.getRegexFromString(v);
          if ( !regex && v === symb ) { return true; } else if ( regex && symb.search(regex) ) { return true; }
        }
        return false;
      }
      return true;
    }
  //@> resolved symbols


  //@< mask
  getMaskByField(iNfield) {
    if (iNfield) {
      const mask = iNfield['body']['rules']['mask'];
      if ( typeof mask === 'object' && Array.isArray(mask) ) {
        // if we have value for mask
        const result = [];
        for (const v of mask) {
          // push regext from string OR string to result array
          const regexp = this.connect.getRegexFromString(v);
          // if value of this string has regexp add regexp to output array or add string
          result.push( regexp || v );
        }
        return result;
      }
    }

    return null;
  }
  //@> mask

  //**LATER delete test data
  static timerIdForDownloadControl;
  static invokeCountertimerIdForDownloadControl = 0;
  static testFirstTimer = null;
  static lastTimerValue = 0;
  // setFormStatusToDownloaded (iNtimeoutMs: number | null = null) {
  //   this.freeform.invokeCounterToDownloadedSetter = this.freeform.invokeCounterToDownloadedSetter;
  //
  //   //increase by one
  //   FreeformCommonService.invokeCountertimerIdForDownloadControl++;
  //   if (typeof this.freeform === 'object') {
  //     this.freeform['invokeCountertimerIdForDownloadControl'] = FreeformCommonService.invokeCountertimerIdForDownloadControl;
  //   }
  //
  //   if ( !FreeformCommonService.testFirstTimer ) {
  //     FreeformCommonService.testFirstTimer = new Date().getTime();
  //     console.log('setFormStatusToDownloaded - timer', FreeformCommonService.testFirstTimer );
  //   }
  //   const timeDefferFromStartTest =  new Date().getTime() - FreeformCommonService.testFirstTimer;
  //   const timeDefferFromLastTest =  new Date().getTime() - FreeformCommonService.lastTimerValue;
  //   FreeformCommonService.lastTimerValue = new Date().getTime();
  //   console.log('setFormStatusToDownloaded', FreeformCommonService.timerIdForDownloadControl, timeDefferFromStartTest, timeDefferFromLastTest);
  //
  //
  //   this.freeform.downloaded = false;
  //
  //   // clear last timer
  //   clearTimeout(FreeformCommonService.timerIdForDownloadControl);
  //
  //   FreeformCommonService.timerIdForDownloadControl = setTimeout(
  //     () => {
  //       // if (typeof this.freeform !== object)
  //       this.freeform.downloaded = true;
  //     },
  //     iNtimeoutMs || 250
  //   );
  // }

  setFormStatusToDownloaded () {
    this.freeform.downloaded = true;
  }





}
