import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

// https://material.angular.io/components/datepicker/examples
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';


// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.

import * as _moment from 'moment';
import {ActivatedRoute, Params} from '@angular/router';
import {FreeformModel} from '../../../../../ConnectSystem/res/shared/service/freeform/model/freeform.model';
import {FreeformComponent} from '../../../../../ConnectSystem/component/freeform/freeform.component';
import {FreeformService} from '../../../../../ConnectSystem/res/shared/service/freeform/freeform.service';
const moment =  _moment;

@Component({
  selector: 'wf24-task-page',
  templateUrl: './task-page.component.html',
  styleUrls: ['./task-page.component.scss'],
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    { provide: MAT_DATE_LOCALE, useValue: 'ru' },
    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    FreeformService
  ],
})
export class TaskPageComponent implements OnInit {

  // pagestepper = [
  //   // { 'name': 'Шаг 1', 'id' : `1`}
  // ];

  // blockOfSteps = [
  //   {'pagestepper': this.pagestepper}
  // ];

  // testMask = [/\d/, /\d/, /\d/, 'x', /\d/, /\d/, /\d/]; //['+7','(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]



  // params from url
  paramModelId;//  = 'model_id1'; // model_id1 // addWork
  paramFormId;//   = 'z8AGstkRdn9y9OGriNVD'; // z8AGstkRdn9y9OGriNVD objId1 // mnzuquU1HJMm8FExXvmU
  paramUid    = 'wideFormat24';

  // firstFormGroup: FormGroup;
  // secondFormGroup: FormGroup;
  formViewFlag = false;

  constructor(
    private _formBuilder: FormBuilder,
    private freeformService: FreeformService,
    private activateRoute: ActivatedRoute
  ) {

    this.activateRoute.queryParams.subscribe( (params: Params ) => {
      let reload = false;
        this.paramModelId = params['modelid'];
        this.paramFormId  = params['formid'];
      }
    );

  }
  /*

  addNew (iNnumber: number) {
    setTimeout(() => {
      // delete this.blockOfSteps[0].pagestepper[1];
      // this.blockOfSteps[0].pagestepper.splice(iNnumber - 1,1);
      console.log('Добавление по номеру ', iNnumber);

      this.blockOfSteps[0].pagestepper.push({'name': 'Шаг ' + iNnumber, 'id': iNnumber + ''});

      if(iNnumber < 10) this.addNew(iNnumber+1); else { this.delNew(iNnumber); }
    },1500);
  }

  delNew (iNnumber: number) {
    setTimeout(() => {
      console.log('Удаление по номеру ', iNnumber);
      // delete this.blockOfSteps[0].pagestepper[1];
      this.blockOfSteps[0].pagestepper.splice(iNnumber - 1,1);

      // this.blockOfSteps[0].pagestepper.push({'name': 'step' + iNnumber, 'id': iNnumber + ''});


      if(iNnumber !== 2) this.delNew(iNnumber-1); else { this.addNew(iNnumber); }
    },250);

  }*/



  ngOnInit() {





    // this.firstFormGroup = this._formBuilder.group({
    //   firstCtrl: ['', Validators.required]
    // });
    // this.secondFormGroup = this._formBuilder.group({
    //   secondCtrl: ['', Validators.required]
    // });

    // const dFreeformService = this.freeformService.getTestData();


    // this.openPageByIdAndUid(this.paramFormId, this.paramUid);


  }

  // @ViewChild('formBuilder') freeformBox: FreeformComponent;


  // openPageByIdAndUid (iNuid: string, iNmodelId: string, iNformId: string ) {
  //   setTimeout(() => {
  //     this.freeformService.getPageByIdAndUid( iNuid, iNmodelId, iNformId ).subscribe(
  //       (form: FreeformModel) => {
  //         // console.log('FreeformModel - form', form);
  //         // this.pagestepper = this.freeformService.getPagesFromModel(form);
  //         // console.log('FreeformModel - this.pagestepper', this.pagestepper);
  //
  //         // this.hideLoader()
  //         // this.showContent();
  //
  //
  //         //invoke sub method
  //         // console.log('freeformBox',this.freeformBox);
  //         // // this.freeformBox.addTestComponent();
  //         // // this.freeformBox.ngOnDestroy();
  //
  //         setTimeout(()=>{
  //
  //           // this.freeformBox.addTestComponent();
  //           // this.freeformBox.ngOnDestroy();
  //         },3500);
  //
  //       }
  //     );
  //   }, 5000);
  // }




}
