import {Directive, HostListener, Input} from '@angular/core';
import {FreeformCommonService} from '../_sub/freeform.common.service';
import {FreeformTriggerService} from '../_sub/triggers/freeform-trigger.service';
import {FreeformValueService} from '../_sub/freeform-value.service';

type FreeformModelFromGlobal = {
  'id': string,
  'modelid': string,
  type?: string
};

@Directive (
  {
    selector: '[freeformObject]'
  }
)
export class FreeformObjectDirective {
  //@enum (type of object) page|group|row|field
  @Input('freeformType') typeName: string;
  //id of object
  @Input('freeformObjId') id: string;
  //id of object
  @Input('freeformBaseId') modelid: string;

  // here we add in init freeform objec
  freeform;
  // here we add in init right model folder (obj key) name
  type;

  // (READ ONLY VAR)  here we add this this object in init
  private _this_object = null;
  get this_object() {
    // get this object
    return (this._this_object) ? this._this_object : this.getObject(this.typeName, this.id, this.modelid);
  }

  // (READ ONLY VAR) here we add data about last object from global in init (if isset) default value null
  private _data_about_last_object: FreeformModelFromGlobal | null = null;
  get data_about_last_object () {
    return this.getLastFocusedObject() || null;
  }

  // (READ ONLY VAR) here we add data about last object with my type from global in init (if isset) default value null
  private _data_about_last_object_this_type: FreeformModelFromGlobal | null = null;
  get data_about_last_object_this_type () {
    let r = this.getFocusedFromGlobal(this.typeName) || null;
    return r;
  }


  // (READ ONLY VAR) here we add last object in init (if isset) default value null
  private _last_object = null;
  get last_object() {
    // get this object
    let lobjdata = this.data_about_last_object;
    if (lobjdata) {
      // if we have last object -> get last object
      const lobj = this.getObject(lobjdata.type, lobjdata.id, lobjdata.modelid);
      if (lobj) { return lobj; }
    }
    return null;
  }

  constructor (
    // private element: ElementRef
    private common: FreeformCommonService, // freeform of object,
    private freeformTriggerService: FreeformTriggerService,
    private valueService: FreeformValueService
  ) {
  }

  ngOnInit () {
    // get access of freeform
    this.freeform = this.common.freeform;

    // get right model folder (obj key) name
    this.type = this.getObjectModelFolderByType(this.typeName);

  }

  getObject (iNtype: string, iNobjId: string, iNmodelId: string) {
    let type = this.getObjectModelFolderByType(iNtype)
    if (
      typeof this.freeform[type] === 'object' &&
      typeof this.freeform[type][iNmodelId] === 'object' &&
      typeof this.freeform[type][iNmodelId]['objects'] === 'object' &&
      typeof this.freeform[type][iNmodelId]['objects'][iNobjId] === 'object'
    ) {
      return this.freeform[type][iNmodelId]['objects'][iNobjId];
    }
    return false;
  }

  getObjectValue (iNtype: string, iNobjId: string, iNmodelId: string) {
    let obj = this.getObject(iNtype, iNobjId, iNmodelId);
    if (
      typeof obj === 'object' &&
      typeof obj['body'] === 'object'
    ) {
      return obj['body']['value'];
    }
    return false;
  }

  @HostListener ('focus') // 'focus', ['$event.target']
  onFocus(target) {

    // run onFocus trigger if need
    this.freeformTriggerService.runLater(this.this_object, ['onFocus']);

  }

  @HostListener ('blur') // 'blur', ['$event.target']
  onBlur(target) {
    // run onBlur trigger if need
    this.freeformTriggerService.runLater(this.this_object, ['onBlur']);
  }

  @HostListener ('click') // 'click', ['$event.target']
  onClick(target) {
    // target.type = 'text';
    if ( this.data_about_last_object && this.id !== this.data_about_last_object.modelid ) {
      //if this first click to this element -> set focus

    }
    let lastObjDataInMyType = this.data_about_last_object_this_type;
    if ( !lastObjDataInMyType || lastObjDataInMyType['id'] !== this.id) { // oldObjData
      // if we have not last obj focused with my type or it was not me
      if (lastObjDataInMyType) {
        // if we have last object not me with my type -> we off focus of this object status
        this.delFocusForObject (
          lastObjDataInMyType.type,
          lastObjDataInMyType.id,
          lastObjDataInMyType.modelid
        );
        // invoke dependent function for last focused object in my type
        this.common.for_dependentStartByObject(
          this.getObject(
            lastObjDataInMyType.type,
            lastObjDataInMyType.id,
            lastObjDataInMyType.modelid
          )
        );

      }
      // set to this element focus state
      this.setFocusForObject (this.typeName, this.id, this.modelid);

      // invoke dependent function for this focused object
      this.common.for_dependentStartByObject(
        this.this_object
      );
    }

    // run onKeyup trigger if need
    this.freeformTriggerService.runLater(this.this_object, ['onClick']);
  }



  @HostListener('change')
  onChange () {
    // start analyse dependents
    this.common.for_dependentStartByObject(this.this_object);


    // for field with not keyboard input
    if ( this.typeName === 'field' ) {


      let status = (this.this_object.body.value) ? true : false;
      //**LATER delete onUpload trigger invoke
      this.valueService.setFieldValue(this.this_object, this.this_object.body.value, ['onChange', 'onUpload']);

    }
  }

  @HostListener('keyup')
  onKeyPress () {
    //**LATER add key up work only for need fields

    // for field with keyboard input
    if ( this.typeName === 'field' ) {
      let status = (this.this_object.body.value) ? true : false;


      this.valueService.setFieldValue(this.this_object, this.this_object.body.value, [], false);

      // //save field value in db
      // this.common.sendFieldValueToDb (this.modelid, this.id, this.this_object.body.value );
      // //save field status in db and in locale
      // this.common.fieldStateLibrary.setFieldStatusLater (
      //   this.id,
      //   this.modelid,
      //   status,
      //   this.freeform,
      //   (iNobjType,iNmodelId, iNbjId, iNstatus) => {
      //     this.common.sendStatusOfFreefomObjectToDb(iNobjType,iNmodelId, iNbjId, iNstatus);
      //   }
      // );

    }
    // start analyse dependents
    this.common.for_dependentStartByObject(this.this_object);


    // run onKeyup trigger if need
    this.freeformTriggerService.runLater(this.this_object, ['onKeyup']);
  }

  public safePrepareFreefomObject () {
    // create if not exist object for generated data
    if (typeof this.freeform['gen'] !== 'object') { this.freeform['gen'] = {}; }
    // create if not exist object for global focus data in generated data
    if (typeof this.freeform['gen']['focus'] !== 'object') { this.freeform['gen']['focus'] = {}; }
  }
  public setFocusForElement (iNobjId: string, iNtype: string, iNmodelId: string) {
    // safe create freeform
    this.safePrepareFreefomObject();

  }

  private getFocusedFromGlobal (iNtype): FreeformModelFromGlobal | null {
    //
    if (typeof this.freeform['gen'] === 'object' && typeof this.freeform['gen']['focus'] === 'object' ) {
      if ( typeof this.freeform['gen']['focus'][iNtype] === 'object' ) {
        return this.freeform['gen']['focus'][iNtype];
      }
    }
    // if not freeform in global return null
    return null;
  }

  private setFocusedToGlobal (iNtype: string, iNobjId: string, iNmodelId: string) {
    // safe create
    this.safePrepareFreefomObject();

    // add focus to global
    this.freeform['gen']['focus'][iNtype] = { // : FreeformModelFromGlobal
      'id'        : iNobjId,
      'modelid'   : iNmodelId,
      'type'      : iNtype
    };
    // add focus for save last element
    this.setLastFocusedObject(iNtype, iNobjId, iNmodelId);
  }

  private setLastFocusedObject (iNtype: string, iNobjId: string, iNmodelId: string) {
    // safe create
    this.safePrepareFreefomObject();

    // add focus for save last element
    this.freeform['gen']['focus']['last'] = { // : FreeformModelFromGlobal
      'id'        : iNobjId,
      'modelid'   : iNmodelId,
      'type'      : iNtype
    };
  }

  private getLastFocusedObject (): FreeformModelFromGlobal | null {
    //
    if (typeof this.freeform['gen'] === 'object' && typeof this.freeform['gen']['focus'] === 'object' ) {
      if ( typeof this.freeform['gen']['focus']['last'] === 'object' ) {
        return this.freeform['gen']['focus']['last'];
      }
    }
    // if not freeform in global return null
    return null;
  }



  private delFocusedFromGlobal (iNtype: string, iNobjId: string, iNmodelId: string) {
    // add focus to global
    this.freeform['gen']['focus'][iNtype] = { // : FreeformModelFromGlobal
    };
  }

  // root functiton
  private setFocusForObject (iNtype: string, iNobjId: string, iNmodelId: string): boolean {
    let objModelType = this.getObjectModelFolderByType(iNtype);
    if (objModelType ) {
      // if we have right folder name

      // we add focus data of object to global place of freeform
      this.setFocusedToGlobal(this.typeName, this.id, this.modelid);

      // we focus state of object to active status
      this.onFocusOfObject(objModelType, iNobjId, iNmodelId);

      return true;
    }
    return false;
  }



  // root functiton
  private delFocusForObject (iNtype: string, iNobjId: string, iNmodelId: string): boolean {
    let objModelType = this.getObjectModelFolderByType(iNtype);

    if (objModelType ) {
      // if we have right folder name
      const oldObjData = this.getFocusedFromGlobal(iNtype);
      if ( oldObjData ) {
        // if we have old object -> we off focus of this object status
        this.offFocusOfObject(objModelType, iNobjId, iNmodelId);
        // delet focus of this object from global status
        this.delFocusedFromGlobal ( iNtype, iNobjId, iNmodelId);
      }
    }
    return false;
  }


  private offFocusOfObject (iNfolderName: string, iNobjId: string, iNmodelId: string): boolean {
    return this.changeFocusStateOfObject(false, iNfolderName, iNobjId, iNmodelId);
  }

  private onFocusOfObject (iNfolderName: string, iNobjId: string, iNmodelId: string): boolean {
    return this.changeFocusStateOfObject(true, iNfolderName, iNobjId, iNmodelId);
  }

  private changeFocusStateOfObject (iNstatus: boolean, iNfolderName: string, iNobjId: string, iNmodelId: string): boolean {
    let objModelType = iNfolderName; //this.getObjectModelFolderByType(iNtype);

    if (objModelType ) {
      // if we have right folder name -> we delete object focus from his status
      let objBody = this.freeform[objModelType][iNmodelId]['objects'][iNobjId]['body'];

      if (typeof objBody['status'] === 'object') {

        if ( iNstatus !== objBody['status']['focus'] ) {
          // off focus status for this object
          objBody['status']['focus'] = iNstatus;
        }

        if ( iNstatus && !objBody['status']['touched'] ) {
          // if first touch to this element set status to touched (we did it only once in first time)
          objBody['status']['touched'] = true;
        } else if ( !iNstatus && objBody['status']['touched'] ) {
          // if first touch out to this element set status to untouched (we did it only once in first time)
          objBody['status']['untouched'] = true;
        }
        return true;
      }
    }
    return false;
  }


  private getObjectModelFolderByType (iNtype: string): string | null {
    let result: string | null = null;
    switch (iNtype) {
      case 'group':
        result =  'groups';
      break;
      case 'field':
        result =  'fields';
      break;
      case 'row':
        result =  'rows';
      break;
      case 'page':
        result =  'pages';
      break;
    }
    return result;
  }
}
