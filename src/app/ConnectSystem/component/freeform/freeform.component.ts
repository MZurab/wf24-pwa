import {
  Component, /*/!*ComponentFactory*!/, ComponentFactoryResolver, /!*ComponentRef*!/,*/ Input, OnInit, SimpleChanges, ViewChild,
  ViewContainerRef
} from '@angular/core';
import {FreeformService} from '../../res/shared/service/freeform/freeform.service';
import {FreeformModel} from '../../res/shared/service/freeform/model/freeform.model';
import {FreeformCommonService} from '../../res/shared/service/freeform/_sub/freeform.common.service';

@Component({
  selector: 'wf24-freeform',
  templateUrl: './freeform.component.html',
  styleUrls: ['./freeform.component.scss'],
  providers: [
  ]
})



export class FreeformComponent implements OnInit {

  @ViewChild('body', { read: ViewContainerRef }) body;
  @ViewChild('stepper', { read: ViewContainerRef }) stepper2;

  //input params
  @Input() userId: string;
  @Input() formId: string = null;
  @Input() modelId: string;
  @Input() initialPageNumber: number;

  freeform = null;

  // create reactive form
  /*form: FormGroup = new FormGroup(
    {
      pages: new FormArray([])
    }
  );*/


  constructor(
    // private componentFactoryResolver: ComponentFactoryResolver,
    private freeformService: FreeformService,
    private common: FreeformCommonService
    // private vc: ViewContainerRef
  ) { }

  ngOnChanges(iNchanges: SimpleChanges) {
    // formId: previousValue  currentValue
    console.log('freeform - ngOnChanges 0' , iNchanges);
    if (
      !iNchanges['modelId'] &&
      iNchanges['formId'] &&
      iNchanges['formId'].previousValue === undefined &&
      !iNchanges['formId'].firstChange
    ) {
      return true;
    }
    console.log('freeform - ngOnChanges 1' , this.userId, this.modelId, this.formId);
    console.log('freeform - ngOnChanges 2' , iNchanges);
    // create form models
    this.openPageByIdAndUid ( this.userId, this.modelId, this.formId );

  }
  ngOnInit( ) {

    // this.freeformService.getPageByIdAndUid("formId1","wideformat24").subscribe(
    //   (response) => {
    //     console.log('response', response);
    //   },
    //   (error) => {
    //     console.log('error', error);
    //   }
    // );
  }

  ngAfterViewInit() {
    let iNuserId      = 'wideFormat24',
        iNnewUserId   = 'wideFormat24',
        iNmodelId     = 'createPage1',
        iNnewModelId  = 'work-article';

    //**LATER delete use when copy
    // this.common.copyFormModel (
    //   'wideFormat24',
    //   'model_id1',
    //   'wideFormat24',
    //   'addWork',
    //   (iNerror, iNresult) => {
    //     console.log('copy - error, result', iNerror, iNresult);
    //   }
    // );
    // ;

      // this.common.copyFormModelAccessList(iNuserId, iNmodelId, iNnewUserId, iNnewModelId,
      //   (iNerror, iNresult) => console.log('copy copyFormModelAccessList - error, result', iNerror, iNresult)
      // );
      // this.common.copyFormModelAccessListForObject(iNuserId, iNmodelId, iNnewUserId, iNnewModelId,
      //   (iNerror, iNresult) => console.log('copy copyFormModelAccessListForObject - error, result', iNerror, iNresult)
      // );
    /*
    */
    let iNdata = {
      "pre": [],
      "body": {
        "name": "Изображение",
        "fields": [
          {
            "id"    : "fieldImage",
            "inid"  : "g6_r1_id1",
            "name"  : "Изображение",
            "weight": 1,
            "payload": {
              "src" : "https://ucarecdn.com/e3a05884-b274-410d-bbc2-d4ac688385c2/left1min.png"
            },
            "view": {
              "width": {
                "comp": 3,
                "tablet": 3,
                "mobile": 3,
                "all": 3
              }
            },
            "required"  : []
          },
          {
            "id": "fieldTextArea",
            "inid": "g6_r1_id2",
            "view": {
              "width": {
                "comp": 9,
                "tablet": 9,
                "mobile": 9,
                "all": 9
              }
            },
            "weight": 2,
          }
        ],
        "status": {
          "required"  : 1,
          "on"        : 0,
          "disabled"  : false,
          "hide"      : false,
          "value"     : false
        }
      },
      "post": [],
      "modelid": "rowIdImage6",
      "options": {
        "object": "row",
        "type": "model",
        "active": true,
        "preload": 1
      }
    };
    // this.common.createModelElement (iNuserId, iNnewModelId, 'm-r-rowIdImage6', iNdata);

    // console.log( 'copy copyModelElements - start' );

    // this.common.copyModelElements ( iNuserId, iNmodelId, iNnewUserId, iNnewModelId,
    //   (iNerror, iNresult) => console.log('copy copyModelElements - error, result', iNerror, iNresult)
    // );

    // this.common.copyFormModel (iNuserId, iNmodelId, iNnewUserId, iNnewModelId,
    //   (iNerror, iNresult) => console.log('copy copyFormModel - error, result', iNerror, iNresult)
    // );

    let elements = [

      'm-f-fieldClearButton',
      'm-f-fieldClearButton1-1',
      'm-f-fieldClearButton1-2',
      'm-f-fieldClearButton1-3',

      'm-f-fieldImage',
      'm-f-fieldImage1-1',
      'm-f-fieldImage1-2',
      'm-f-fieldImage1-3',

      'm-f-fieldImageUpload',
      'm-f-fieldImageUpload1-1',
      'm-f-fieldImageUpload1-2',
      'm-f-fieldImageUpload1-3',

      'm-f-fieldTextArea',

      'm-r-rowIdClearButton1',

      'm-g-groupId0',
      'm-g-groupId1',
      'm-g-groupId2',
      'm-g-groupId3',
      'm-g-groupId4',
      'm-g-groupId5',
      'm-g-groupId6',

      'm-p-pageId1',
      'm-r-rowIdDate',

      'm-r-rowIdImage',
      'm-r-rowIdImage2',
      'm-r-rowIdImage3',
      'm-r-rowIdImage4',
      'm-r-rowIdImage5',
      'm-r-rowIdImage6',

      'm-r-rowIdName',

      'm-r-rowIdTextArea',
      'm-r-rowIdTextArea1',

      'm-r-rowIdTitle',

      'm-r-rowIdUpload',
      'm-r-rowIdUpload1',
    ];
    for (let elModelId of elements) {
      // this.common.copyFormModelFieldModel (iNuserId, iNmodelId, elModelId, iNnewUserId, iNnewModelId, elModelId ,
      //
      //   (iNerror, iNresult) => console.log(`copy elModel - ${elModelId}`, elModelId, iNerror, iNresult)
      // );
    }

    // this.common.copyFormModelAccessListForObject (iNuserId, iNmodelId, iNnewUserId, iNnewModelId,
    //   (iNerror, iNresult) => console.log(`copy copyFormModelAccessListForObject - `, iNerror, iNresult)
    // );

    // this.common.copyFormModelFieldModel (iNuserId, iNmodelId, 'm-r-rowIdTextArea', iNnewUserId, iNnewModelId, 'm-r-rowIdName' ,
    //
    //   (iNerror, iNresult) => console.log('copy copyFormModelFieldModel - error, result', iNerror, iNresult)
    // );
    //

    // this.common.copyFormModelFieldModel (iNuserId, iNmodelId, 'm-r-rowIdClearButton1',
    //   iNnewUserId,
    //   iNnewModelId,
    //   'm-r-rowIdClearButton1',
    //
    //   (iNerror, iNresult) => console.log('copy copyFormModelFieldModel - error, result', iNerror, iNresult)
    // );

    //
    // this.common.copyFormModelFieldModel (iNuserId, iNmodelId, 'm-r-rowIdTextArea', iNnewUserId, iNnewModelId, 'm-r-rowIdDate' ,
    //
    //   (iNerror, iNresult) => console.log('copy copyFormModelFieldModel - error, result', iNerror, iNresult)
    // );



    // this.common.copyFormModelFieldModel (iNuserId, iNmodelId, 'm-f-fieldImageUpload', iNnewUserId, iNnewModelId, 'm-f-fieldClearButton' ,
    //
    //   (iNerror, iNresult) => console.log('copy copyFormModelFieldModel - error, result', iNerror, iNresult)
    // );
    // this.common.copyFormModelFieldModel (iNuserId, iNmodelId, 'fieldIdTextArea', iNnewUserId, iNnewModelId, 'm-f-fieldIdTextArea' ,
    //
    //   (iNerror, iNresult) => console.log('copy copyFormModelFieldModel - error, result', iNerror, iNresult)
    // );
  }

  // public addTestComponent () {//: ComponentRef<any>
  //   console.log("invoked addTestComponent");
  //   let factory = this.componentFactoryResolver.resolveComponentFactory(TextInputComponent);
  //   let factory2 = this.componentFactoryResolver.resolveComponentFactory(FreeformPageComponent);
  //   console.log("this.componentFactoryResolver.resolveComponentFactory(TextInputComponent) 1",this.componentFactoryResolver.resolveComponentFactory(TextInputComponent));
  //   console.log("this.componentFactoryResolver.resolveComponentFactory(TextInputComponent) 2",this.componentFactoryResolver.resolveComponentFactory(TextInputComponent));
  //   console.log("this.componentFactoryResolver.resolveComponentFactory(TextInputComponent) 3",this.componentFactoryResolver.resolveComponentFactory(TextInputComponent));
  //
  //   // let ref     = this.cmpRef = this.body.createComponent(factory );
  //
  //   console.log('this.body',this.body);
  //   // let ref = this.body.createComponent(factory );
  //   let ref2 = this.stepper2.createComponent(factory2);
  //
  //
  //   // ref.instance.getContainer().createComponent(factory2);
  //   ref2.instance.output1.subscribe((iNobject)=>{
  //     console.log('getFromPage', iNobject);
  //   })
  //
  //
  //   // this.body.nativeElement.querySelector("input")
  //   // console.log("inboked addTestComponent result ref - ", ref);
  //   return;
  // }

  ngOnDestroy() {
    // if (this.cmpRef) {
    //   this.cmpRef.destroy();
    // }
  }


  //@< loader
    loaderViewFlag = true;
    hideLoader () {
      this.loaderViewFlag = false;
    }
    showLoader () {
      this.loaderViewFlag = true;
    }
  //@> loader

  //@< content
    bodyViewFlag = false;
    showContent () {
      this.bodyViewFlag = true;
    }
    hideContent () {
      this.bodyViewFlag = false;
    }
  //@> content


  openPageByIdAndUid (iNuid: string, iNmodelId: string, iNformId: string = null ) {

    this.showLoader();
    this.hideContent();

    //anulater invoke counter (may be show with loader when form loading)
    FreeformCommonService.invokeCountertimerIdForDownloadControl = 0;

    this.freeformService.getPageByIdAndUid( iNuid, iNmodelId, iNformId ).subscribe(
      (form: FreeformModel ) => {
        // set freeform -> view form
        this.freeform = form;
        this.freeform.downloaded = false;

        //add angular form LATER add for ever form (multi form) not single form
        /*if (typeof  this.freeform['angular'] !== 'object' ) {this.freeform['angular'] = {}; }
        this.freeform['angular']['form'] = this.form;*/

        // view formbodyViewFlag
        this.hideLoader();
        this.showContent();

      },
      (err) => {
        // we have not access to this form or this form not exist -> return error
        this.freeform = { 'error': 'Форма не существует или у Вас  нет доступа к этой форме.', 'destroyed': true };
      }
    );
  }

}
