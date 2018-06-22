import {Injectable} from '@angular/core';
import {FreeformFieldStateLibrary} from './freeform-field-state.library';
import {FreeformCommonService} from './freeform.common.service';
import {FreeformTriggerService} from './triggers/freeform-trigger.service';
import {ConnectLibrary} from './connect.library';

@Injectable()
export class FreeformValueService {

  // connect library
  connect = new ConnectLibrary();

  constructor (
    public common: FreeformCommonService,
    public trigger: FreeformTriggerService

  ) {
    this.trigger.valueService = this;
  }
  public setFieldPayloadOptions (iNelement: object, iNvalue: object, iNtrigersStartList = ['onChange', 'onSetValue'], iNdependetStart = false ) {

    console.log('setFieldPayloadOptions 1 ', 'INVOKE');
    let element = iNelement,
      value     = iNvalue,
      status,
      freeform  = this.common.freeform;

    if (
      typeof value !== 'object' || !Array.isArray(value)
    )
      return;

    status = (value.length > 0 ) ? true : false;

    console.log('setFieldPayloadOptions 2 ', 'payload.options', status, value);
    this.setElementDataByPath('field', iNelement, 'payload.options', value, iNtrigersStartList, iNdependetStart , true);

    //change state
    new FreeformFieldStateLibrary().setFieldStatusLater ( element['id'], element['modelid'], status, freeform,
      (iNtype, iNmodelId, iNelId, iNstatus) => {
        // update status
        this.common.sendStatusOfFreefomObjectToDb(iNtype, iNmodelId, iNelId, iNstatus);
      }
    );
  }


  public setFieldValue (iNelement: object, iNvalue: string | number, iNtrigersStartList = ['onChange', 'onSetValue'], iNdependetStart = false ) {

    console.log('setFieldValue', 'INVOKE');
    let element   = iNelement,
        value     = iNvalue,
        freeform  = this.common.freeform;

    //**LATER (remove circular used trigger) get library trigger

    // set value for field -> safe convert to string
    if (
      typeof value === 'string' ||
      typeof value === 'number'
    ) value = value + '';
    else
      return;

    let status    = ( value ) ? true : false;

    // add value to db
     this.setElementDataByPath('field', element, 'value', value, iNtrigersStartList, iNdependetStart , true);

    //change state
      new FreeformFieldStateLibrary().setFieldStatusLater ( element['id'], element['modelid'], status, freeform,
        (iNtype, iNmodelId, iNelId, iNstatus) => {
          // update status
          this.common.sendStatusOfFreefomObjectToDb(iNtype, iNmodelId, iNelId, iNstatus);
        }
      );

  }

  public setElementDataByPath (
    iNelType,
    iNelement: object,
    iNpath: string,
    iNvalue: any,
    iNtrigersStartList = ['onChange'],
    iNdependetStart = false,
    iNsynsWithDB = false
  ) {
    console.log('setElementDataByPath', 'INVOKE', iNelType, iNsynsWithDB);
    let element   = iNelement,
        id        = element['id'],
        modelid   = element['modelid'],
        path      = iNpath,
        value     = iNvalue,
        freeform  = this.common.freeform,
        triggersList = iNtrigersStartList,
        depStart  = iNdependetStart;

    //**LATER (remove circular used trigger) get library trigger

    // set value for element
    this.connect.addValueToObjectByPath(element['body'], path, value);

    //@need 'sendElementValueByPathToDb' instead of 'sendFieldValueToDb'
    if ( iNsynsWithDB ) {
      // if we need sync with db -> save data by path in DB
      this.common.sendElementValueByPathToDb (iNelType, modelid, id, path, value );
    }

    //**LATER (remove circular used trigger) run onChange trigger if exist
    if (
      typeof triggersList === 'object' &&
      Array.isArray(triggersList) &&
      triggersList.length > 0
    ) {
      // we have triggers for start
      this.trigger.runLater( element, triggersList );
    }

    if (depStart) {
      // start analyse dependents if need
      this.common.for_dependentStartByObject(element);
    }
  }

}
