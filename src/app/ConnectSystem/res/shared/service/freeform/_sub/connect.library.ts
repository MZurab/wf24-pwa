import * as uuidv4 from 'uuid/v4';

export class ConnectLibrary {

  constructor () {

  }

  //@< for objects

    public getValueFromObjectByPath (iNpath: string, iNobject: object): any | null {
      //@
      let obj                 = iNobject,
        splitedPathArray    = iNpath.split('.'),
        arrayName           = splitedPathArray[0],
        result;
      // we have not sub path -> get result
      result = obj[arrayName]
      if (result) {
        // if we have object -> check for subpath
        if ( splitedPathArray.length > 1 ) {
          // we have sub path -> did request
          let newPath = splitedPathArray.splice(1).join('.');
          if ( typeof result === 'object' ) {
            // if we have subpath and have object  -> recursive object
            let r =  this.getValueFromObjectByPath( newPath, result );
            return r;
          } else {
            // if we have subpath but have not object -> return null
            return null;
          }
        } else {
          // if we have not subpath -> return result
          return result;
        }
      }
      // if we have not object
      return null;
    }

    public addValueToObjectByPath ( iNobject, iNpath, iNdata ) {
      //@example - addValueToObjectByPath ( {}, 'a.b.c', any )
      let obj                 = iNobject,
        data                = iNdata,
        splitedPathArray    = iNpath.split('.'),
        arrayName           = splitedPathArray[0],
        result;

      // we have not sub path -> get result
        if (splitedPathArray.length > 1) {
          let newPath = splitedPathArray.splice(1).join('.');

          if ( typeof obj[arrayName] !== 'object') {
            obj [ arrayName ] = {};
          }
          this.addValueToObjectByPath( obj[arrayName], newPath, data);
        } else {
          //if this last
          if ( typeof obj[arrayName] === 'object') {
            obj[arrayName] = this.mergeObject( data, obj[arrayName] );
          } else {
            obj[arrayName] = data;
          }
        }
    }
  //@> for objects


  getRegexFromString (iNstr) {
    let r = /\/(.*)\/(.*)/.exec(iNstr);
    if (r) {
      return new RegExp(r[1], r[2]);
    }
    return null;
  }

  public getUuid () {
    return  uuidv4();
  }

  public deepcopy<T>(object: T): T {
    // return JSON.parse(JSON.stringify(o));
    let node;
    if (object === null) {
      node = object;
    }
    else if (Array.isArray(object)) {
      node = object.slice(0) || [];
      node.forEach(n => {
        if (typeof n === 'object' && n !== {} || Array.isArray(n)) {
          n = this.deepcopy(n);
        }
      });
    }
    else if (typeof object === 'object') {
      node = Object.assign({}, object);
      Object.keys(node).forEach(key => {
        if (typeof node[key] === 'object' && node[key] !== {}) {
          node[key] = this.deepcopy(node[key]);
        }
      });
    }
    else {
      node = object;
    }
    return node;
  }

  public mergeObject (iNobject, iNobject2) {
    let arrOfKeys = Object.keys(iNobject2);
    for (let k of arrOfKeys) {
      //
      let el = iNobject2[k];

      if ( typeof el === 'object' && !Array.isArray(el) && el) {
        // create object if not
        if ( typeof iNobject[k] !== 'object' ) iNobject[k] = {};
        // copy this object
        this.mergeObject(iNobject[k], el);
      } else {
        // set new val if in original object is not isset
        if ( typeof iNobject[k] === 'undefined' ) {
          iNobject[k] = el;
        }
      }
    }
    return iNobject;
  }


//

}
