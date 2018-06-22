import {Injectable} from '@angular/core';
import {FreeformCommonService} from '../freeform.common.service';
import {FreeformActionLibrary} from './freeform-action.library';

@Injectable()
export class FreeformTriggerService {

  constructor (
    private common: FreeformCommonService
  ) {
  }

  //we later add timer
  static timeoutStoreForFields;

  public valueService;

  public runLater (iNfreeformObject: object, iNstart: Array<string> ) {
    let freeformObject     = iNfreeformObject;

    if ( freeformObject ) {
      let id = freeformObject['id'];

      // if we have store with timers create object (first time)
      if ( typeof FreeformTriggerService.timeoutStoreForFields !== 'object' ) {
        FreeformTriggerService.timeoutStoreForFields = {};
      }
      // clear last timeout
      clearTimeout( FreeformTriggerService.timeoutStoreForFields[id] );

      // run timeout
      FreeformTriggerService.timeoutStoreForFields[id] = setTimeout(
        () => {
          this.run(freeformObject, iNstart);
        },
        50
      );
    }

  }

  public run (iNfreeformObject: object, iNstart: Array<string>  ): boolean {
    let freeformObject     = iNfreeformObject,
      triggers  = freeformObject['body']['triggers'],
      start     = iNstart; // trigger type

    console.log('triggers.run  - freeformObject, start', freeformObject, start);
    if (
      typeof triggers === 'object' && // if triggers is object
      triggers['active'] && // if triggers is active
      ( typeof triggers['events'] === 'object' && Object.keys( triggers['events'] ).length > 0 ) // if we have body functions is active
    ) {

      console.log('triggers.run  - 2 - triggers',  triggers);
      // start action functios
      let events = triggers['events'];
      for ( let eventName of Object.keys(events) ) {

        // find this action
        if ( start.indexOf(eventName) > -1 && events[eventName]['active']) {
          // if trigger need to start && and it's active -> start
          console.log('triggers.run  - 3 - startTrigger - events, eventName, events[eventName]',  events, eventName, events[eventName],  );
          this.startTrigger(freeformObject, events[eventName] );
        }
      }

    }
    return false;
  }

  public startTrigger (iNfield, iNtrigger): boolean {
    let field     = iNfield,
      trigger   = iNtrigger,
      active    = trigger['active'], // actions active
      actions   = trigger['actions']; // actions action
    console.log('triggers.startTrigger  - 1 - trigger',  trigger  );

    // if triggers is not active stop funciton
    if ( !active ) { return false; }
    console.log('triggers.startTrigger  - 2 - active',  active  );



    let FreeformAction   = new FreeformActionLibrary(this.common.freeform, this.valueService );

    // run actions from this field
    FreeformAction.run(field, actions);
  }


}
