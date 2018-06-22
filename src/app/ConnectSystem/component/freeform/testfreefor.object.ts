var pages = [
  {
    id: 'pageId1',
    title: '1 шаг',
    weight: 1,

    groups: [
      {
        id: 'groupId1',
        weight: 1,

        rows: [
          {
            id: 'rowId1',
            weight: 1,

            fields: [
              {
                id: 'fieldId1',
                weight: 1,
                title: 'Первое поле',
                display: {
                  mobile 	: 3,
                  comp 	: 3,
                  '*' 	: 3,
                },
                type: "text"
              },

              {
                id: 'fieldId2',
                weight: 2,
                title: 'Второе поле',
                display: {
                  mobile 	: 3,
                  comp 	: 3,
                  '*' 	: 3,
                },
                type: "number"
              }
            ],
          }
        ]
      },

      {
        id: 'groupId2',
        weight: 2,

        rows: [
          {
            id: 'rowId2',
            weight: 2,

            fields: [
              {
                id: 'fieldId3',
                weight: 3,
                title: 'Третье поле',
                display: {
                  mobile 	: 6,
                  comp 	: 6,
                  '*' 	: 6,
                },
                type: "text"
              },

              {
                id: 'fieldId4',
                weight: 4,
                title: 'Четвертое поле',
                display: {
                  mobile 	: 6,
                  comp 	: 6,
                  '*' 	: 6,
                },
                type: "number"
              }
            ],
          }
        ]
      }
    ]
  }
]

var freeeformtemplate = {
  "id": "formId1",

  "status": 1,
  "form": {
    "id": "formId1",
      "initialMap": [
      {
        "id": "pageId1",
        "weight": 3
      },
      {
        "id": "pageId2",
        "weight": 2
      }
    ],
      "pages"   : {
      "pageId1" : {
        "base"   : {
          "pre": [],
            "body": {
            "name": "Шаг 1",
              "groups": [
              {
                "id": "groupId1",
                "weight": 2
              }
            ]
          },
          "post": [
          ]
        }
      },
      "pageId2" : {
        "base"   : {
          "pre": [],
            "body": {
            "name": "Шаг 2",
              "groups": [
              {
                "id": "groupId2",
                "weight": 1
              }
            ]
          },
          "post": []
        }
      },
      "pageId3" : {
        "base"   : {
          "pre": [],
            "body": {
            "name": "Шаг 3",
              "groups": [
              {
                "id": "groupId3",
                "weight": 1
              }
            ]
          },
          "post": []
        }
      }
    },
    "groups"   : {
      "groupId1": {
        "base"   : {
          "pre": [],
            "body": {
            "name": "Группа 1",
              "rows": [
              {
                "id": "rowId1",
                "weight": 1
              }
            ]
          },
          "post": []
        }
      },
      "groupId2": {
        "base"   : {
          "pre": [],
            "body": {
            "name": "Группа 2",
              "rows": [
              {
                "id": "rowId2",
                "weight": 1
              }
            ]
          },
          "post": []
        }
      },
      "groupId3": {
        "base"   : {
          "pre": [],
            "body": {
            "name": "Группа 3",
              "rows": [
              {
                "id": "rowId3",
                "weight": 1
              }
            ]
          },
          "post": []
        }
      }
    },
    "rows"   : {
      "rowId1": {
        "base"   : {
          "pre": [],
            "body": {
            "name": "Строка 1",
              "fields": [
              {
                "id": "fieldId1",
                "weight": 1
              },
              {
                "id": "fieldId2",
                "weight": 2
              }
            ]
          },
          "post": []
        }
      },
      "rowId2": {
        "base"   : {
          "pre": [],
            "body": {
            "name": "Строка 2",
              "fields": [
              {
                "id": "fieldId2",
                "weight": 1
              }
            ]
          },
          "post": []
        }
      },
      "rowId3": {
        "base"   : {
          "pre": [],
            "body": {
            "name": "Строка 3",
              "fields": [
              {
                "id": "fieldId3",
                "weight": 1
              }
            ]
          },
          "post": []
        }
      }
    },
    "fields": {
      "fieldId1" : {
        "base"  : {
          "pre": [],
            "body": {
            "name": "Поле 1",
              "type": "text",
              "actions": {
              "onsubmit": {
                "name" : "request"
              }
            },
            "rules": {
              "mask": "",
                "for": [
                {
                  "id": "fieldId1",
                  "weight": 1
                }
              ],
                "relation": [],
                "validation": [
                {}
              ]
            },
            "payload": {
            },
            "view": {
              "width": {
                "comp": 3,
                  "tablet": 3,
                  "mobile": 3,
                  "all": 3
              }
            }
          },
          "post": []
        }
      },
      "fieldId2" : {
        "base"  : {
          "pre": [],
            "body": {
            "name": "Поле 2",
              "type": "upload",
              "actions": {
              "onsubmit": {
                "name" : "request"
              }
            },
            "rules": {
              "mask": "",
                "for": ["fieldId1"],
                "relation": []
            },
            "payload": {
              "options": [
                {
                  "key": "key1",
                  "val": "Выбор 1"
                }
              ]
            },
            "view": {
              "width": {
                "comp": 6,
                  "tablet": 6,
                  "mobile": 6,
                  "all": 6
              }
            }
          },
          "post": []
        }
      }
    }
  }
}
