import {ConnectLibrary} from './connect.library';
import {FreeformCommonLibrary} from './freeform-common.library';

export class FreeformUrlLibrary {
  // later we add freeform
  freeform;

  // late we add http
  http;

  setFreeform (iNfreeform) {
    this.freeform = iNfreeform;
  }

  // freeform common library
  freeformCommon = new FreeformCommonLibrary();

  constructor (
    iNfreeform,
    iNhttp
  ) {
    this.freeform = iNfreeform;
    this.http     = iNhttp;
  }

  //@< url
    private getUrlWithQueryString (iNurl: string, iNparams: object | null = null ) {
      let url     = iNurl,
          params  = iNparams;

      if (typeof params === 'object') {
        let queryStrings = this.getQueryStringFromParams(params);
        if (queryStrings) {
          let findParams = url.indexOf('?');
          if ( findParams > -1) {
            // if we have allready in url params -> add new params
            return url + '&' + queryStrings;
          } else {
            // if we have  not allready in url params -> set new params
            return url + '?' + queryStrings;
          }
        } else {
          return url;
        }
      }
    }

    private getQueryStringFromParams (iNparams) {
      let params = iNparams;
      return Object.keys(params).map((key) => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
      }).join('&');
    }
  //@> url

  public doByRequest ( iNrequest, iNfreeformObject, iNcallback, iNfreeform: object | null = null) {
    //** LATER create common request library or add to url library
    //set url library for work

    // set freeform if passed
    if ( iNfreeform ) this.setFreeform(iNfreeform);

    let field       = iNfreeformObject,
        request     = iNrequest,
        url         = request['url'],
        params      = this.getParams (       request['params'],  iNfreeformObject, iNfreeform ),
        body        = this.getBodyForPost (  request['body'],    iNfreeformObject, iNfreeform ),
        headers     = this.getHeaders (      request['headers'], iNfreeformObject, iNfreeform ),
        requestType = request['requestType'] || 'get',
        callback    = iNcallback;

    if ( typeof callback === 'function' ) {
      // do request with callaback function
      this.doRequestWithCallback ( callback, requestType, url, params, body, headers );
    } else {
      // do request without callaback function
      this.doRequest ( requestType, url, params, body, headers );
    }
  }

  public doRequest ( iNurl,  iNtype: string | null, iNparams: object | null, iNbody: object | null, iNheaders: object | null ) {
    let url       = iNurl,
        headers   = iNheaders,
        body      = iNbody,
        params    = iNparams,
        type      = iNtype || 'get',
        options;


    // update url params if we have
    if ( params ) {
      url = this.getUrlWithQueryString( url, params );
    }
    // add headers if we have
    if ( headers && typeof headers === 'object' ) {
      options = {
        'headers': headers
      };
    }
    switch ( type ) {
      case 'post':
        // post request
        if (options)
          return this.http.post( url, body, options );
        else
          return this.http.post( url, body );
      // break;
      default:
        // get reauest
        if (options) {
          return this.http.get( url, options );
        } else {
          return this.http.get( url );
        }
      // break;
    }
  }

  private doRequestWithCallback ( iNcallback, iNtype: string | null, iNurl, iNparams: object | null, iNbody: object | null, iNheaders: object | null ) {

    let resultOfRequest = this.doRequest ( iNurl,  iNtype, iNparams, iNbody, iNheaders ),
        callback        = iNcallback;

    resultOfRequest.subscribe(
      (response) => {
        if ( typeof callback === 'function' ) {
          callback(response);
        }
      }
    );
  }


  // private getRequestType (iNfield): string | null {
  //   let field = iNfield;
  //   if (
  //     typeof field.body.payload.request === 'object' &&
  //     typeof field.body.payload.request.requestType === 'string'
  //   ) {
  //     return field.body.payload.request.requestType;
  //   }
  //   return null;
  // }

  private getHeaders ( iNobject: Array<object> | null, iNfield: object, iNfreeform: object ): object | null {
    // get headers for request
    let objects   = iNobject,
        result    = {},
        isHeader  = false;

    if ( objects ) {
      for (let obj of objects) {
        let key = obj['key'],
          val = this.freeformCommon.getFreeformObjectValue(obj, iNfield, iNfreeform);
        // add to result object
        result[key] = val;
        // set true when get first result
        if (!isHeader) isHeader = true;
      }
    }
    return (isHeader) ? result : null;
  }

  private getBodyForPost ( iNobject: Array<object> | null, iNfield: object, iNfreeform: object ): object | null {
    return this.getHeaders( iNobject, iNfield, iNfreeform );
  }

  private getParams ( iNparams: Array<object> | null, iNfield: object, iNfreeform: object ) {
    // get 'get' params  for request
    let objects   = iNparams,
        result    = {},
        isParams  = false;
    if ( objects ) {
      for (let obj of objects) {
        let key = obj['key'],
          val = this.freeformCommon.getFreeformObjectValue
          (obj['val'], iNfield, iNfreeform);

        // add to result object
        result[key] = val;

        // set true when get first result
        if (!isParams) isParams = true;
      }
    }

    return (isParams) ? result : null;
  }

}
