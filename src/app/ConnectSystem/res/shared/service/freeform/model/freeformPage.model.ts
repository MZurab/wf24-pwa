export class FreeformFieldModel {
  constructor(
    public groupId: string,
    public pageId: string,
    public formId: string,
    public weight: number,
    public row: string,
    public required: boolean,
    public view: FreeformFieldViewModel,
    public actions: FreeformFieldActionsModel
  ) {}
}
  export class FreeformFieldViewModel {
    constructor (
      public width: viewWidth,
      public display: string,
      public helperText: string,
      public errorText: string,
      public successText: string,
      public titleText: string,
    ) {}
  }
    type viewWidth = {
      'comp': number;
      'phone': number;
      'tablet': number;
      '*': number;
      'fix': number;
    };

export class FreeformFieldActionsModel {
  constructor(
    public onChange: {},
    public onBlur: {},
    public onFocuseOut: {},
    public onFocusIn: {},
    public onClick: {},
    public onHoverIn: {},
    public onHoverOut: {},
    public onCut: {},
    public onCopy: {},
    public onPast: {},
    public onSuccess: {},
    public onFail: {},
    public onSubmit: {},
    public onCancel: {},
    public onClear: {},
    //
    public onKeyUp: {},
    public onKeyDown: {},
    public onKeyPress: {},
    //
    public onChangeData: {},
    public onRequest: {},
  ) {}
}

/*
{ //model/$modelID/fields/$fieldID
  id: 'id1',
  groupId: "groupId1",
  pageId: "pageId",
  roldeId: "",
  row: 1,
  weight: 1,
  required: false,
  view: {
    device : {
      'comp': 4,
      'phone': 4,
      'tablet': 4,
      '*': 4,
    },
    display: "none",
  },
  triggers : {
    onChange : {},
    onUnfocused : {},
    onClick : {},
    onFocuse : {},
    onChangeData : {},
  },
  guard: {
    mask : [
      {
      }
    ]
  },
  relation : {
    for : [
      {
        formId: '', //#1 oneOf G#1
        fieldId: '',//#2 oneOf G#1
        groupId: '',//#3 oneOf G#1
        uid: "",//#4 if (#1)
        type: "field" //string enume [field|group|page|row|form]
        status: number
      }
    ],
  },
  body: {
    'name'        : "Наименование поля",
    'placeholder' : "Placeholder поля",
    'type'        : "text",
    'dataType'    : 'request|simple',
    'data'        : [{}],
  }


};
*/
