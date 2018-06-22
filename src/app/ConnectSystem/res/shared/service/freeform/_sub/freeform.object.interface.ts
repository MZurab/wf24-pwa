import {FreeformReadyObjectModel} from '../model/freeform.model';

export interface FreeformObjectInterface {
  create (iNobject: object, iNparentForChild: object | null, iNnewInIdObject, iNfullDownloaded: boolean, iNcallback);
  check (iNobject: object);
  getObjectFromModel (iNobject: object, iNparentForChild: object | null, iNnewInIdObject, iNfullDownloaded: boolean, iNcallback);
}
