import {FreeformCommonLibrary} from '../freeform-common.library';
import {ConnectLibrary} from '../connect.library';

export class FreeformActionLibrary {
  // global freeform
  freeform;

  // freeform common value
  freeformCommon = new FreeformCommonLibrary();



  // get common connect library
  connect = new ConnectLibrary();

  //
  valueService;

  constructor (iNfreeform, iNvalueService) {
    this.freeform = iNfreeform;
    this.valueService = iNvalueService;
  }

  public run (iNfield: object, iNactions: Array<any> ): boolean {
    let field     = iNfield,
        actions   = iNactions;

    if (
      typeof actions === 'object' && // if triggers is object
      Array.isArray( actions ) // if we have body functions is active
    ) {
      // get action functios
      for ( let action of actions ) {
        // start action
        this.startAction(field, action);
      }

    }
    return false;
  }

  public startAction (iNelement , iNaction: object ): boolean {
    console.log('actions.startAction  - 1 - iNaction',  iNaction  );
    let element   = iNelement,
        action    = iNaction,
        active    = action['active'], // action active
        type      = action['type']; // action type

    // if triggers is not active stop funciton
    if (!action ) { return false; }

    console.log('actions.startAction  - 2 - action',  action  );
    // run actions from this element
    switch (type)  {
      case 'setFieldValue':
        /*
            @discr -
              type    : string = setFieldValue
              id      : string
              value   : fieldValue
        */
        this.setFieldValue(action, element);
      break;

      case 'setFileSource':
        /*
            @discr -
              type    : string = setFileSource
              id      : string
              value   : fieldValue
        */
        this.setFileSource(action, element);
        break;
    }
  }

  //@action - setFieldValue
  setFieldValue (iNaction: object, iNstartElement: object  ): boolean {
    // setFieldValur
    // set field value
    const action = iNaction,
          id      = action['id'], // field object
          value   = action['value'], // field object
          field   = this.freeformCommon.getFreefomObjectByInId ( id, this.freeform, ['fields'] );

    if (field) {
      // if field is isset
      const valueResult = this.freeformCommon.getFreeformObjectValue (value, field, this.freeform, iNstartElement);

      if ( valueResult ) {
        // set new value of freeform
        this.valueService.setFieldValue( field, valueResult,['onChange','onSetValue'], true );
        // run trigger
        return true;
      }
    }
    return false;
  }


  //@action - setFileSource (only for field-image, field-video)
  setFileSource (iNaction: object , iNstartElement: object ): boolean {
    console.log('actions.setFileSource  - 1 - iNaction',  iNaction  );
    const action  = iNaction,
          id      = this.freeformCommon.getFreeformObjectValue ( action['id'], null, this.freeform, iNstartElement ), // field object
          value   = action['value'], // field object
          field   = this.freeformCommon.getFreefomObjectByInId ( id, this.freeform, ['fields','pages','groups','rows'] );
    console.log('actions.setFileSource  - 1.1 - id, field', id, field);
    if (field) {
      // if field is isset -
      const valueResult = this.freeformCommon.getFreeformObjectValue (value, field, this.freeform, iNstartElement);
      console.log('actions.setFileSource  - 2 - value, valueResult, field', value,'valueResult', valueResult,'field', field  );

      if ( valueResult ) {
        // set new value of freeform
        // this.valueService.setFieldValue( field, valueResult,['onChange','onSetValue'], true );

        this.valueService.setElementDataByPath (
          'field',
          field,
          'payload.src',
           valueResult,
          ['onChange', 'onSetSrc' ],
          true,
          true
        );

        // run trigger
        return true;
      }
    }
    return false;
  }

}
