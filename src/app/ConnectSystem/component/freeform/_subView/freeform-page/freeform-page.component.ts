import {Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef} from '@angular/core';
// import {FreeformGroupComponent} from '../freeform-group/freeform-group.component';
// const uuidv4 = require('uuid/v4');
// import uuidv4 from 'uuid/v4';
import {forEach} from '@angular/router/src/utils/collection';
import {AbstractControl} from '@angular/forms';
import {FreeformCommonService} from '../../../../res/shared/service/freeform/_sub/freeform.common.service';
// import {Wf24} from '../../../../../../../scripts';



@Component({
  selector: 'wf24-freeform-page',
  templateUrl: './freeform-page.component.html',
  styleUrls: ['./freeform-page.component.scss']
})


// class Controle: AbstractControl {
//
// }
export class FreeformPageComponent implements OnInit {

  // @ViewChild('parentContainer', { read: ViewContainerRef }) parentContainer;
  @ViewChild('container1', { read: ViewContainerRef }) container1;

  // optionas regular
  containersArray: ViewContainerRef[] = [this.container1];

  isLinear = true;

  controllForPage = {
    // valid: false,
    invalid: true
  }

  @Output('outputName') output1 = new EventEmitter<{}>();

  @Input('freeform') freeform;
  @Input('disabled') disabled;

  hideStepper = false;

  constructor(
    private common: FreeformCommonService
  ) {
  }



  outputObject = {a: 0};
  ngOnInit() {
    //@< hide stepper
      if (
        this.common.freeform.options.view &&
        this.common.freeform.options.view.hideStepper
      ) {
        this.hideStepper = this.common.freeform.options.view.hideStepper;
      }
    //@> hide stepper
  }


  submitPage (iNbtn) {
    let btn = iNbtn;

    //show loader
    this.common.freeform.downloaded = false;

    this.common.submitForm(
      null,
      null,
      null,
      (error) => {
        //hide loader
        this.common.freeform.downloaded = true;

        if (error) {
          // show error message -> not close form
          //**LATER add multilanguage
          this.common.freeform['error'] = {'*': 'Не возможно сохранить форму.'}
          return;
        }
        // we successed submit form -> close form -> show success message
        this.common.freeform['success'] = {'*': 'Форма успешно сохранена.'}
        //close form
        this.common.freeform['destroyed'] = true;
      }
    );
    console.log('submitPage', btn);
  }

  previousPage (iNbtn) {
    let btn = iNbtn;
    console.log('previousPage', btn);
  }

  nextPage (iNbtn) {
    let btn = iNbtn;
  }


}
