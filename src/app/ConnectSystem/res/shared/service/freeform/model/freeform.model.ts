

export class FreeformModel {
  constructor(
    public id: string,
    public initialMap: FreeforModelReferenceModel[],
    public map: FreeforObjectReferenceModel[],
    public pages: {}, // pageId: { name, status}
    public groups: {}, // pageId: { name, status}
    public rows: {}, // pageId: { name, status}
    public fields: {}, // pageId: { name, status}
    public status: number
  ){}
}
  export class FreeforModelReferenceModel {
    constructor (
      public id:      string,
      public weight:  number,
      public inid?:   string
    ){}
  }
  export class FreeforObjectReferenceModel {
    constructor (
      public baseid:  string,
      public objid:   string,
      public inid?:   string,
      public weight?: number
    ){}
  }
    export class FreeformGroupModel {
      constructor(
        public weight: number,
        public field: string[],
        public groupId: string
      ){}
    }

    export  class FreeformReadyObjectModel {
      constructor(
        public id: string
      ){}

    }

/*
{ //model/$modelID
    id : 'id1',
    map : {
      'pageId1': {
        'groups' : [
          'groupId1': {
    'fields' : [
      'fieldId1',
      'fieldId2'
    ],
      'weight': 1
  },
  'groupId2': {
    'fields' : [
      'fieldId3',
      'fieldId4'
    ],
      'weight': 2
  }
  ],
  'weight': 1
  },
  'pageId2': {
    'groups' : [
      'groupId3': {
      'fields' : [
        'fieldId5',
        'fieldId6'
      ],
        'weight': 3
    },
    'groupId4': {
      'fields' : [
        'fieldId7',
        'fieldId8'
      ],
        'weight': 4
    }
  ],
    'weight': 2
  }
  }
};
*/


