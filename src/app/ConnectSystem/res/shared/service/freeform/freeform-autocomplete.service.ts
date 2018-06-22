import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FreeformCommonService} from './_sub/freeform.common.service';
import {FreeformUrlLibrary} from './_sub/freeform-url.library';
import {FreeformCommonLibrary} from './_sub/freeform-common.library';

@Injectable()
export class FreeformAutocompleteService {
  // we add late freeform url
  freeformUrl;

  // default timeout (if field has not timeout)
  defaultTimeout = 50;


  // get freeform common library
  freeformCommon = new FreeformCommonLibrary();

  // add late global timeout id
  static timeoutId;


  constructor (
    private http:   HttpClient,
    private common: FreeformCommonService
  ) {
  }

  //run with
  public runWithTimeout (iNcallback, iNfield, iNfreeform) {
    // clear timeout
    clearTimeout( FreeformAutocompleteService.timeoutId );

    // get timeout from field OR default
    let timeout = this.getTimeout(iNfield);

    // run function timeout
    FreeformAutocompleteService.timeoutId = setTimeout(
      () => {
        this.run(iNcallback, iNfield, iNfreeform);
      },
      timeout
    );
  }

  private getTimer (iNfield) {
    let timer = iNfield['body']['']
  }

  //root
  private run (iNcallback, iNfield, iNfreeform ) {
    let field       = iNfield,
        isRequest   = this.isRequest(field),
        freeform    = iNfreeform,
        callback    = iNcallback,
        options     = iNfield['body']['payload']['options'];

    if ( isRequest ) {
      this.doRequestForAutocomplete(callback, field, options, freeform);
    }
  }

  private saveAutocompleteResponseToFreeformObject (iNfield, iNresponse) {
    let key = 'field-autocomplete';
    this.freeformCommon.saveResponseToFreeformObject(iNfield, key, iNresponse);
  }

  public saveAutocompleteSelectedToFreeformObject (iNfield, iNselectResult) {
    let key = 'field-autocomplete';
    this.freeformCommon.saveSelectedToFreeformObject(iNfield, key, iNselectResult);
  }

  private doRequestForAutocomplete (iNcallback, iNfreeformObject, iNautocompleteObject, iNfreeform) {
    //** LATER create common request library or add to url library
    //set url library for work
    this.freeformUrl = new FreeformUrlLibrary(iNfreeform, this.http);

    let field       = iNfreeformObject,
        payload     = field['body']['payload'],
        request     = payload['request'],
        callback    = (response) => {
          // proccess this response
          this.processResponse (iNcallback, iNfreeformObject, response );
        };
    // do request with callaback function


    this.freeformUrl.doByRequest ( request, iNfreeformObject, callback);

    // doByRequest ( iNrequest, iNfreeformObject, iNcallback
  }

  private isRequest (iNfield): boolean {
    let field = iNfield;
    if (
      typeof field.body.payload['request'] === 'object' &&
      typeof field.body.payload['request'].url  === 'string' &&
      field.body.payload.type &&
      field.body.payload.type === 'request'
    ) {
      return true;
    }
    return false;
  }

  private getRequestType (iNfield): string | null {
    let field = iNfield;
    if (
      typeof field.body.payload.request === 'object' &&
      typeof field.body.payload.request.requestType === 'string'
    ) {
      return field.body.payload.request.requestType;
    }
    return null;
  }

  private getTimeout (iNfield): number | null {
    let field = iNfield;
    if (
      typeof field.body.payload.request === 'object' &&
      typeof field.body.payload.request.timeout === 'number'
    ) {
      return field.body.payload.request.timeout;
    }
    return this.defaultTimeout;
  }

  saveIndexForLateAccess (iNvalue: string, iNndex: string, iNobject: object ) {
    iNobject[ iNvalue ] = iNndex;
  }
  getIndexByValue (iNvalue, iNobject) {
    return iNobject[iNvalue];
  }

  processResponse (iNcallback, iNfield, iNresponse: object | null ) {
    let response          = iNresponse,
        pathToImg         = this.getPathToImg( iNfield ),
        pathToValue       = this.getPathToValue( iNfield ),
        pathToExtra       = this.getPathToExtra( iNfield ),
        pathToChiefArray  = this.getPathToChiefArray( iNfield ),
        callback          = iNcallback,
        outputArray = [],
        indexArray = {};

    if ( typeof response === 'object') {
      let chiefArray = this.common.connect.getValueFromObjectByPath (pathToChiefArray , iNresponse);


      if (
        chiefArray &&
        typeof chiefArray === 'object' &&
        Array.isArray(chiefArray) &&
        chiefArray.length > 0
      ) {
        for ( let ind in chiefArray ) {
          let el = chiefArray[ind],
              val = this.common.connect.getValueFromObjectByPath( pathToValue, el ),
              resultObj  = {},
              img, extra;

          resultObj['full'] = el;

          resultObj['val']  = val;
          // add image if exist
          if ( pathToImg ) {
            img = this.common.connect.getValueFromObjectByPath( pathToImg, el );
            if (img) {
              resultObj['img']  = img;
            }
          }

          // add extra field if exist
          if ( pathToImg ) {
            extra = this.common.connect.getValueFromObjectByPath( pathToExtra, el );
            if (extra) {
              resultObj['extra']  = extra;
            }
          }
          // add full object
          resultObj['full'] = el;

          // save index for late access to this array
          this.saveIndexForLateAccess(val , ind, indexArray);

          // add to array with autocomplete value result
          outputArray[ind] = resultObj;
        }
        // add new array to output object
        if (
          typeof  callback === 'function'
        ) {
          callback(outputArray, indexArray);
        }
      }

      // save last response for this field for
      this.saveAutocompleteResponseToFreeformObject(iNfield, response);

      // set data to automplete hepler
      chiefArray = this.common.connect.getValueFromObjectByPath (pathToChiefArray , iNresponse);
    }
  }

  private getPathToChiefArray (iNfield): string | null {
    let field = iNfield;
    if (
      field.body.payload.pathToArray &&
      typeof field.body.payload.pathToArray === 'string'
    ) {
      return field.body.payload.pathToArray;

    }
    return null;
  }

  private getPathToValue (iNfield): string | null {
    let field = iNfield;
    if (
      field.body.payload.pathToValue &&
      typeof field.body.payload.pathToValue === 'string'
    ) {
      return field.body.payload.pathToValue;

    }
    return null;
  }

  private getPathToImg (iNfield): string | null {
    let field = iNfield;
    if (
      field.body.payload.pathToImg &&
      typeof field.body.payload.pathToImg === 'string'
    ) {
      return field.body.payload.pathToImg;
    }
    return null;
  }

  private getPathToExtra (iNfield): string | null {
    let field = iNfield;
    if (
      field.body.payload.pathToExtra &&
      typeof field.body.payload.pathToExtra === 'string'
    ) {
      return field.body.payload.pathToExtra;
    }
    return null;
  }

  public filter(iNfield, iNoptions): string[] {
    let val = iNfield['field'];
    return iNoptions.filter(
      option => {
        return option.val.toLowerCase().indexOf( val.toLowerCase() ) === 0
      }
    );
  }


}
