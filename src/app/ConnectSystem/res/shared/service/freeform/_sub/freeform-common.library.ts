import {ConnectLibrary} from './connect.library';
// import {FreeformFieldStateLibrary} from './freeform-field-state.library';

export class FreeformCommonLibrary {

  constructor () {

  }



  // public getFreeformObjectValue (iNobject: object | null , iNfreeformObject: object, iNfreeform: object) {
  //   /*
  //     iNobject
  //       @required
  //         type = thisFieldValue | fieldValue | value
  //         ....
  //    */
  //   let obj = iNobject;
  //   if ( typeof obj !== 'object') {
  //     return obj;
  //   } else {
  //     let type = obj['type'] || 'value';
  //
  //     switch (type) {
  //       case 'value':
  //         return obj['value'];
  //
  //       case 'thisFieldValue': //* only for - field-*
  //         return iNfreeformObject['body']['value'];
  //
  //       case 'fromAutocompleteResponse': //* only for - field-autocmplete
  //         return (iNfreeformObject['gen']['response'] || {} )['field-autocomplete'] || null;
  //
  //       case 'fromAutocompleteSelected': //* only for - field-autocmplete
  //         return (iNfreeformObject['gen']['selected'] || {} )['field-autocomplete'] || null;
  //
  //       case 'fieldValue': // ( for field-* )
  //         let modelid   = obj['modelid'],
  //           objid     = obj['objid'],
  //           freeform  = iNfreeform;
  //         return freeform['fields'][ modelid ]['objects'][ objid ];
  //     }
  //   }
  // }

  // connect library
  connect = new ConnectLibrary();

  // field state library
  // fieldStateLibrary = new FreeformFieldStateLibrary();


  public getField(iNid: string, iNmodelId: string, iNfreeform ) {
    return iNfreeform['fields'][ iNmodelId ][ iNid ];
  }

  // public setFieldValue (iNfield: object, iNvalue: string, iNfreeform, iNcallbackForChangeStatus, iNcallbackAfterSetValue ) {
  //
  //   let field     = iNfield,
  //       value     = iNvalue,
  //       freeform  = iNfreeform,
  //       status    = ( iNvalue ) ? true : false;
  //
  //   //**LATER (remove circular used trigger) get library trigger
  //   let triggerLibrary = new FreeformTriggerLibrary(iNfreeform);
  //
  //   // set value for field
  //   if (typeof value === 'string') field['body']['value'] = value;
  //
  //   if ( typeof iNcallbackAfterSetValue === 'function' ) {
  //     iNcallbackAfterSetValue();
  //   }
  //
  //   //**LATER (remove circular used trigger) run onChange trigger if exist
  //   triggerLibrary.runLater( field, ['onChange', 'onSetValue'] );
  //
  //   this.fieldStateLibrary.setFieldStatusLater ( field['id'], field['modelid'], status, freeform, iNcallbackForChangeStatus );
  // }


  public getFreeformObjectValue (iNobject: object | null , iNfreeformObject: object| null, iNfreeform: object, iNstartElement: object | null = null) {
    /*
      iNobject
        @required
          type = thisFieldValue | fieldValue | value
          ....
     */
    const obj = iNobject,
          startElement = iNstartElement;
    console.log('getFreeformObjectValue - startElement', startElement);

    if ( typeof obj !== 'object') {
      return obj;
    } else {
      const type = obj['type'] || 'value';

      switch (type) {
        case 'value':
          return obj['value'];

        case '@self':
          // get trigger initiator object (NEW)
          if ( obj['pathToValue'] && startElement) {
            return this.connect.getValueFromObjectByPath(obj['pathToValue'], startElement);
          } else {
            return startElement;
          }

        case '@self-value':
          // get value from trigger initiator object (NEW) - CHECKED SUCCESS
          return this.connect.getValueFromObjectByPath('body.value', startElement);
          // startElement['body']['value'];

        case '@lid': {
          // get this element by local id || get value by path from this element by local id (NEW)
          const elIdBylidEl = this.getElementIdByLocalId (iNfreeform, obj['lid'], startElement);
          if (elIdBylidEl) {
            const lidEl = this.getFreefomObjectByInId ( elIdBylidEl, iNfreeform, ['fields','pages','groups','rows'] );
            if ( obj['pathToValue'] && lidEl) {
              return this.connect.getValueFromObjectByPath(obj['pathToValue'], lidEl);
            } else {
              return elIdBylidEl;
            }
          }
          return null;
        }


        case '@lid-value': {
          // get this element by local id || get value by path from this element by local id (NEW)
          const elIdBylidEl = this.getElementIdByLocalId (iNfreeform, obj['lid'], startElement);
          if (elIdBylidEl) {
            const lidEl = this.getFreefomObjectByInId ( elIdBylidEl, iNfreeform, ['fields','pages','groups','rows'] );
            if (lidEl) {
              return this.connect.getValueFromObjectByPath('body.value', lidEl);
            } else {
              return elIdBylidEl;
            }
          }
          return null;
          // const lidEl = this.getElementByLocalId (iNfreeform, obj['lid'], startElement);
          // if ( lidEl) {
          //   return this.connect.getValueFromObjectByPath('body.value', lidEl);
          // } else {
          //   return lidEl;
          // }
        }
        // break;

        case '@lid-id': {
          // get this element by local id || get value by path from this element by local id (NEW) (CHECKED SUCCESS)
          const elIdBylidEl = this.getElementIdByLocalId (iNfreeform, obj['lid'], startElement);
          console.log('getFreeformObjectValue @lid-id - lidEl', elIdBylidEl );
          return elIdBylidEl;
        }
        // break;


        case '@this-element':// (ONLY WITH iNfreeformObject)
          // get this element || get value by path from this element (NEW)
          if ( obj['pathToValue'] && iNfreeformObject) {
            return this.connect.getValueFromObjectByPath(obj['pathToValue'], iNfreeformObject);
          } else {
            return iNfreeformObject;
          }

        case 'thisFieldValue': //(ONLY WITH iNfreeformObject)
          // * only for - field-*
          return iNfreeformObject['body']['value'];

        case 'fromAutocompleteResponse': //* only for - field-autocmplete
          {
            let   id              = obj['id'], // freeform object id
                  freeformObject  = this.getFreefomObjectByInId(id, iNfreeform), // get freeform object (field-autocomplete)
                  gen             = this.getGeneratedBlockForFreeformObject(freeformObject), // get generated block
                  response        = ( (gen['response'] || {} )['field-autocomplete'] || null ), // get if we have selected obj last for field autocomplete
                  result          = null; // default result

            if (response) {
                result = this.connect.getValueFromObjectByPath(obj['pathToValue'], response);
            }

            return result;
          }

        case 'fromAutocompleteSelected': //* only for - field-autocmplete
          {
            let id              = obj['id'], // freeform object id
                freeformObject  = this.getFreefomObjectByInId(id, iNfreeform), // get freeform object (field-autocomplete)
                gen             = this.getGeneratedBlockForFreeformObject(freeformObject), // get generated block
                selected        = ( (gen['selected'] || {} )['field-autocomplete'] || null ), // get if we have selected obj last for field autocomplete
                result          = null; // default result

                if (selected) {
                  result = this.connect.getValueFromObjectByPath(obj['pathToValue'], selected);
                }

                return result;
          }
        case 'fieldValue': // ( for field-* )
          {
            const modelid   = obj['modelid'],
                objid     = obj['objid'],
                freeform  = iNfreeform;
            return freeform['fields'][ modelid ]['objects'][ objid ]['body']['value'];
          }

        case '$ed': // element user data ( for field-* )
          {
            const id        = this.getFreeformObjectValue (obj['id'], iNfreeformObject, iNfreeform, iNstartElement) ,
                freeform    = iNfreeform,
                pathToValue = obj['pathToValue'], // required element (2/2)
                el = this.getFreefomObjectByInId (id  , freeform);

            console.log('$ed - id', id, '-----', obj['id']);
            if (
              typeof pathToValue === 'string' &&
              pathToValue &&
              el &&
              el['body']['payload'] &&
              el['body']['payload']['$ed']
            ) {
              // we have $ed (custom user data) for object -> r value
              return this.connect.getValueFromObjectByPath(pathToValue, el['body']['payload']['$ed'] );
            }
            // we have no $ed for this object -> r null
            return null;
          }
      }
    }
  }


  getFolderNameByElementType (iNtype) {
    let elType = iNtype, folder = null;
    switch (elType) {
      case 'page':
        folder = 'pages';
      break;

      case 'row':
        folder = 'rows';
      break;

      case 'group':
        folder = 'groups';
      break;

      case 'field':
        folder = 'fields';
      break;

      case 'collections':
        folder = 'fields';
      break;
    }

    return folder;
  }

  //@< PARENT BLOCK
    getParentBlockFromElement (iNelement) {
      //@disct - get parent bloc from element
      let options = iNelement['options'],
        result  =  { 'type': options['p-type'] },
        pkeys = this.getKeysForParenIdAndModelId (result['type']);

      if ( !pkeys ) return null;
      result['id'] = options[ pkeys['id'] ];
      result['mid'] = options[ pkeys['mid'] ];

      return result;
    }

    getKeysForParenIdAndModelId (iNtype) { //@private
      const  type    = iNtype;
      let    keyObjId,
        keyModelId;

      switch (type) {
        case "page":
          keyObjId    = 'p-p-id';
          keyModelId  = 'p-p-mid';
          break;
        case "row":
          keyObjId    = 'p-r-id';
          keyModelId  = 'p-r-mid';
          break;
        case "group":
          keyObjId    = 'p-g-id';
          keyModelId  = 'p-g-mid';
          break;
        case "collection":
          keyObjId    = 'p-c-id';
          keyModelId  = 'p-c-mid';
          break;
      }

      if ( keyObjId ) {
        return  {
          'id'    : keyObjId,
          'mid'   : keyModelId,
        }
      }

      return null;
    }
  //@> PARENT BLOCK

  //@< work elements by local id
    getElement (iNform, iNfolder, iNelModelId, iNelId): object | null { // can be static method
      if (
        iNform &&
        iNform[iNfolder] &&
        iNform[iNfolder][iNelModelId] &&
        iNform[iNfolder][iNelModelId]['objects'] &&
        iNform[iNfolder][iNelModelId]['objects'][iNelId]
      ) {
        return iNform[iNfolder][iNelModelId]['objects'][iNelId];
      }
      return null;
    }
    private getElementByLocalIdFromParent (iNform, iNtype, iNlid, iNelement, iNelType = null) { // : string | object
      // g
      const elType  = iNelType,
          type    = iNtype,
          el      = iNelement;

      console.log('getElementByLocalIdFromParent - 1 INVOKE -  iNtype, iNelType, iNlid, iNelement ' ,  iNtype, iNelType, iNlid, iNelement );

      if (
         elType && elType === type
      ) {
        // we need get id from this object
        console.log('getElementByLocalIdFromParent - 2 need get id from this object' ,  el, iNlid );
        if (
          el &&
          el['body'] &&
          el['body']['gen'] &&
          el['body']['gen']['lid'] &&
          el['body']['gen']['lid'][iNlid]
        ) {
          console.log('getElementByLocalIdFromParent - 21 need get id from this object' , el['body']['gen']['lid'][iNlid],  iNlid, el['body']['gen']['lid'][iNlid], el['body']['gen']['lid'] );
          return el['body']['gen']['lid'][iNlid];
        }
      } else {
        // we need get id from parent
        const parent = this.getParentBlockFromElement(el);
        console.log('getElementByLocalIdFromParent - 3 nneed get id from parent' ,  parent );
        if ( !parent ) { return null; } // we have not parent

        const folder = this.getFolderNameByElementType (parent['type']);
        if ( !folder ) { return null; } // we have not folder
        console.log('getElementByLocalIdFromParent - 4 foldert' ,  folder );

        const parentEl = this.getElement( iNform, folder, parent['mid'], parent['id'] );
        console.log('getElementByLocalIdFromParent - 5 parentEl' ,  parentEl );

        return this.getElementByLocalIdFromParent(iNform, iNtype, iNlid, parentEl, parent['type'] );
      }

      console.log('getElementByLocalIdFromParent - 6 ERROR'  );
      return null;
    }

    public getElementIdByLocalId (iNform, iNlocalIdWithPrefix, iNstartField): string | null {
      //
      let element       = iNstartField,
          lidWithPrefix = iNlocalIdWithPrefix,
          result        = this.parseLocalIdWithPrefix(lidWithPrefix),
          lid,
          type;

      console.log('getElementByLocalId - 1 INVOKE - iNform, iNlocalIdWithPrefix, iNstartField' , iNform, iNlocalIdWithPrefix, iNstartField);
      console.log('getElementByLocalId - 2 lidWithPrefix, result' , lidWithPrefix, result);

      if ( !result ) {
        // we have not rigt local id with prefix
        return null;
      }

      // we have rigt local id with prefix && type object
      lid = result['id']; type = result['type'];
      console.log('getElementByLocalId - 3 type, lid' , type, lid);
      let r = this.getElementByLocalIdFromParent( iNform, type, lid, element );
      console.log('getElementByLocalId - 4 r' , r);
      return r;
    }

    private parseLocalIdWithPrefix (iNlocalId: string): object { // can by static
      //
      const lidWithPrefix     = iNlocalId,
          lidWithOutPrefix  = lidWithPrefix.slice(3);
      if ( lidWithPrefix.indexOf('lg-') !== -1 ) {
        // group
        return { 'type': 'group', 'id': lidWithOutPrefix };
      } else if ( lidWithPrefix.indexOf('lp-') !== -1 ) {
        // page
        return { 'type': 'page', 'id': lidWithOutPrefix };
      } else if ( lidWithPrefix.indexOf('lr-') !== -1 ) {
        // row
        return { 'type': 'row', 'id': lidWithOutPrefix };
      } else if ( lidWithPrefix.indexOf('lc-') !== -1 ) {
        // collection
        return { 'type': 'collection', 'id': lidWithOutPrefix };
      }
      return null;
    }
  //@> work elements by local id

  getGeneratedBlockForFreeformObject (iNfreeformObject) {
    // if isset not we create this block
    if (typeof iNfreeformObject['body']['gen'] !== 'object') {
      iNfreeformObject['body']['gen'] = {};
    }

    return iNfreeformObject['body']['gen'];
  }

  //
    getFreefomObjectByInId (iNinId: string, iNfreeform, iNsearchObjects: Array<string> | null = null): object {
      // get model of this
      const freeform   = iNfreeform; //this._freeform;

      // categories which search
      const search     = iNsearchObjects || [ 'fields', 'pages', 'groups', 'rows' ];

      for ( const type of search ) {
        // search in this cateogry
        for (const modelid of Object.keys( freeform[type] ) ) {
          //search in this categories' models if this model has objects (created object by this model)
          if (!freeform[type][modelid]['objects']) { continue; }

          for (const objid of Object.keys( freeform[type][modelid]['objects'] ) ) {
            // search in this models' objects
            const obj = freeform[type][modelid]['objects'][objid];
            if ( iNinId === obj['id'] ) { return obj; }
          }
        }
      }
      return null;
    }
  //

  //@<  response
    public getResponseFromFreeformObject ( iNfreeformObject: object, iNkey: string ): any | null {
      //@disc - get last result for http request from freeform-object (field, group, collection, row)
      //@disc - for field-autocomplete and freeform-* which do request to server
      const freefomObject = iNfreeformObject,
            key = iNkey;

      // create if wa have not response block yet (invoke first time)
      if (
        typeof freefomObject['body']['gen']['response'] !== 'object'
      ) {
        return null;
      }
      return freefomObject['body']['gen']['response'][key] || null;
    }

    public saveResponseToFreeformObject ( iNfreeformObject: object, iNkey: string,  iNresponse: any ): void {
      //@disc - save last result for http request from freeform-object (field, group, collection, row)
      const freefomObject = iNfreeformObject,
            response      = iNresponse,
            key = iNkey;

      // create if wa have not response block yet (invoke first time)
      if (
        typeof freefomObject['body']['gen']['response'] !== 'object'
      ) {
        freefomObject['body']['gen']['response'] = {};
      }

      freefomObject['body']['gen']['response'][key] = response;
    }

  //@> response


  //@<  selected result
  public getSelectedResultFromFreeformObject ( iNfreeformObject: object, iNkey: string ): any | null {
    //@disc - get last result for http request from freeform-object (field, group, collection, row)
    //@disc - for field-autocomplete and freeform-* which do request to server
    const freefomObject = iNfreeformObject,
      key = iNkey;

    // create if wa have not response block yet (invoke first time)
    if (
      typeof freefomObject['body']['gen']['selected'] !== 'object'
    ) {
      return null;
    }
    return freefomObject['body']['gen']['selected'][key] || null;
  }

  public saveSelectedToFreeformObject ( iNfreeformObject: object, iNkey: string,  iNselectedResult: any ): void {
    //@disc - save last result for http request from freeform-object (field, group, collection, row)
    const freefomObject = iNfreeformObject,
      selectedResult     = iNselectedResult,
      key = iNkey;

    // create if wa have not response block yet (invoke first time)
    if (
      typeof freefomObject['body']['gen']['selected'] !== 'object'
    ) {
      freefomObject['body']['gen']['selected'] = {};
    }

    freefomObject['body']['gen']['selected'][key] = selectedResult;
  }

  //@> selected result


}
