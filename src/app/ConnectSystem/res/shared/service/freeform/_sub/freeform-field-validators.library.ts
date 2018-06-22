import {AbstractControl, FormControl, ValidatorFn, Validators} from '@angular/forms';

export class FreeformFieldValidatorLibrary {

  freeform;
  form;
  field;

  constructor(
    iNfreeform,
    iNfield,
    iNform
  ) {
    this.freeform = iNfreeform;
    this.field    = iNfield;
    this.form     = iNform;
    // add tgus
    // this.run();
  }

  //@< ERROR
  //   private getErrorTextFromValidator (iNvalidator: object): null | string {
  //     let validator = iNvalidator;
  //     return this.getErrorText(validator.errorText);
  //   }

    private setFieldStatus (iNstatus: boolean, iNfield: object) {
      if (
        typeof iNfield['body']['status'] === 'object' &&
        iNfield['body']['status']['value'] !== iNstatus
      ) {
        iNfield['body']['status']['value'] = iNstatus;
        return true;
      }
      return false;
    }

    private setValidatorError (iNfield, iNvalidator) {
      if (
        typeof iNvalidator['error'] === 'object' ||
        typeof iNvalidator['error'] === 'string'
      ) {
        this.setError( iNfield, iNvalidator['error']);
        return true;
      }
      return false;
    }

    private clearError (iNfield) {
      this.setError( iNfield, "" );
    }

    private setError (iNfield, iNerror: object | string | null) {
      iNfield['body']['gen']['errorOfValidator'] =  iNerror;

    }
  //@> ERROR

  private compare (iNvalue: string, iNvalidator) {
    let validator = iNvalidator,
        value     = iNvalue,
        r         = false;
    switch (validator['payload']['compare']) {
      case "!isEqual":
         r = this.compareIsEqual(value, validator);
      break;
      case "isEqual":
        r = !this.compareIsEqual(value, validator);
        break;
      case "!isEqualRegex":
        r = this.compareIsEqualRegex (value, validator);
      break;
      case "isEqualRegex":
        r = !this.compareIsEqualRegex (value, validator);
      break;



    }
    return r;
  }

  //ASYNS **LATER
  phoneAsynsValidator (controll: FormControl) : Promise<any> {
    return new Promise(
      (resolve,reject) => {
        setTimeout(
          () => {
            if (controll.value.length < 11) {
              resolve (
                {
                  errorLength2 : true
                }
              )
            }
            resolve (null);
          },
          3000
        )
      }
    )
  }

  private isRequiredField (iNfield) {
    let field = iNfield,
      required = field.body.status.required;

    if (
      typeof required === 'object' &&
      Array.isArray(required) &&
      required.length > 0
    ) {
      return true;
    }

    return false;
  }

  private addIfNeedRequiredValidator (iNoutArrValidator: Array<any>, iNfield: object): boolean {


    if ( this.isRequiredField(iNfield) ) {
      // if this field required add validator
      iNoutArrValidator.push(Validators.required);
      return true;
    }
    return false;
  }

  public run() {
    let synsValidators  = [],
        asynsValidators = [],
        hasAsyns        = false,
        hasSyns         = false;
    // add if need syns validators
    hasSyns = this.addIfNeedSynsValidators(synsValidators, this.field);
    // add if need asyns validators
    hasAsyns = this.addIfNeedAsynsValidators(asynsValidators, this.field);

    if ( hasSyns && hasAsyns) {
      // we have both validator add -> add this
      this.form.controls['field'].setValidators( synsValidators, asynsValidators );
    } else if ( hasSyns && !hasAsyns ) {
      // we have only syns validators -> add this
      this.form.controls['field'].setValidators( synsValidators );
    } else if ( !hasSyns && hasAsyns ) {
      // we have only asyns validators -> add this
      this.form.controls['field'].setValidators( null, asynsValidators );
    }
    return false;
  }

  private runSynsValidatorsWithBinding () {
    return this.runSynsValidators.bind(this);
  }
  private addIfNeedAsynsValidators (iNoutArrValidator: Array<any>, iNfield: object): boolean {

    // LATER FINISH THIS FUNC
    let asynsValidators = iNoutArrValidator;



    if ( asynsValidators.length > 0 ) {
      return true;
    }

    return false;
  }


  private addIfNeedSynsValidators (iNoutArrValidator: Array<any>, iNfield: object): boolean {


    let synsValidators = iNoutArrValidator;

    // add required validator if need
    this.addIfNeedRequiredValidator(synsValidators, this.field);

    // add required validator if need
    let countOther = this.countOfSynsValidators();
    if ( countOther > 0 ) {
      // if we have syns validators
      synsValidators.push(
        this.runSynsValidatorsWithBinding()
      );
    }

    if ( synsValidators.length > 0 ) {
      return true;
    }

    return false;
  }

  private countOfSynsValidators (): number {

    let validators  = this.field.body.rules.validators,
        typeOfSynsValidators = [
          'compare'
        ],
        resultCounter = 0;
    if (typeof validators === 'object') {
      for (let k of Object.keys(validators)) {
        let v     = validators[k],
            type  = v['type']
        if (typeOfSynsValidators.indexOf(type) !== -1) {
          resultCounter++;
        }
      }
    }
    return resultCounter;
  }

  private runSynsValidators (iNcontrol): null | any {
    let controll    = iNcontrol,
        value       = controll.value,
        validators  = this.field.body.rules.validators,
        fieldStatus = true; //default active

    let result  = {},
        counter = 0,
        errorFromValidator = null;

    if (typeof validators === 'object') {
      for (let k of Object.keys(validators) ) {
        //
        let v = validators[k];

        switch (v['type']) {
          case "compare":
            let r = this.compare(value, v);
            if (r) {
              // if the validater return not null -> increase counter
              counter++;
              // add to result object code
              result[k] = true;
              // set error if is first time (we have not error yet)
              if (!errorFromValidator) errorFromValidator = this.setValidatorError (this.field, v);
            }
            break;
        }
      }

    }

    if (!errorFromValidator) {
      // if we have not any error -> we return/set default error
      this.clearError(this.field);
    }
    if (counter) {
      // we have some error -> set field status null
      fieldStatus = false;
    }

    // we set this field status is true
    this.setFieldStatus (fieldStatus, this.field);

    // add count of erros
    result['errorCounter'] = counter;
    // return result if has any error
    return (counter) ? result : null;
  }

  compareIsEqual ( iNvalue, iNvalidator ): boolean {
    let value   = iNvalidator['payload']['value'];
    if ( value ===  iNvalue ) {
      return true;
    }
    return false;
  }
  compareIsEqualRegex ( iNvalue, iNvalidator ): boolean {
    let value   = iNvalidator['payload']['value'];
      let regex = this.getRegexFromString(value);
      if (regex) {
        return regex.test(iNvalue);
      } else {
        return (value ===  iNvalue);
      }
  }
  getRegexFromString (iNstr) {
    let r = /\/(.*)\/(.*)/.exec(iNstr);
    if (r) {
      return new RegExp(r[1], r[2]);
    }
    return null;
  }
}
