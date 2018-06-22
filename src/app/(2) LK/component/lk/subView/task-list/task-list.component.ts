import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'wf24-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {

  someObject = {};

  constructor() { }

  ngOnInit() {
    this.someObject[1] = false;
    this.someObject[2] = true;
    this.someObject[3] = false;
    this.someObject[4] = true;
  }
  ngAfterViewInit () {
    // setTimeout(() => {
    //
    //   this.someObject[1] = false;
    //   this.someObject[2] = false;
    //   this.someObject[3] = false;
    //   this.someObject[4] = false;
    //   this.someObject[5] = true;
    //   this.someObject[6] = true;
    //   setTimeout(() => {
    //
    //     this.someObject[1] = true;
    //     this.someObject[2] = true;
    //     this.someObject[3] = true;
    //     this.someObject[4] = false;
    //     this.someObject[5] = false;
    //     this.someObject[6] = false;
    //   },5000);
    // },5000);
    // this.dataSource.sort = this.sort;
  }




  getStatusTextByNumber (iNnumber: number) {
    let result = {};
    switch(iNnumber) {
      case 1:
        result = { text: 'В процессе', 'background': 'yellow',    'color' : 'black',   'textDecoration': '',              'boldLevel': 0};
        break;
      case 2:
        result = { text: 'Стоп',       'background': 'red',         'color' : 'white',      'textDecoration': '' ,            'boldLevel': 0};
        break;
      case 3:
        result = { text: 'Стоп', 'background': 'red',      'color' : 'white',    'textDecoration': '',             'boldLevel': 0 };
        break;
      case 4:
        result = { text: 'Не принята',  'background': '',         'color' : 'red',      'textDecoration': 'line-through', 'boldLevel': 0 };
        break;
      case 5:
        result = { text: 'Завершена',   'background': 'green',    'color' : 'white',    'textDecoration': '',             'boldLevel': 0 };
        break;
      default:
        result = { text: 'Создана',     'background': '',         'color' : '',         'textDecoration': '' ,            'boldLevel': 700 };
        break;
    }
    return result;
  }

  getTextDateByTimestamp (iNtimestamp: number) {
    return iNtimestamp; //Date(iNtimestamp).toLocaleDateString();
  }


  getDateFinishedByTimestamp (iNtimestamp: number, iNstatus: number) {
    let timeStamp = new Date().getTime();
    let result = {};
    result['time']  = this.getTextDateByTimestamp(iNtimestamp);
    result['color'] = '';
    // Для защиты от установки для завершенных задач
    if (iNstatus !== 5) {
      if ((iNtimestamp - timeStamp ) <= (2 * 24 * 60 * 60 * 1000) && iNstatus !== 2 && iNstatus !== 3 && iNstatus !== 4) {
        result['color'] = 'red';
        result['background'] = '';
      } else if ((iNtimestamp - timeStamp) <= (3 * 24 * 60 * 60 * 1000) ) {
        result['color'] = '';
        result['background'] = '';
      }

    }
    return result;
  }

  ELEMENT_DATA = [
    {position: 1, name : "Шоко",      project : "Бланк №1",   author: 'Hydrogen',   manager: "Иванов Иван",     status: 0,  dateFinished: 1521072000000, dateCreated: 1520553600000, priority: "Норма", workshop:"Цех 1"},
    {position: 2, name : "ЛМС",       project : "Бланк №3",   author: 'Helium',     manager: "Петров Сергей",   status: 1,  dateFinished: 1521158400000, dateCreated: 1520467200000, priority: "Норма", workshop:"Цех 2"},
    {position: 3, name : "РАВОН",     project : "Бланк №2",   author: 'Lithium',    manager: "Сидорова Фекла",  status: 2,  dateFinished: 1521072000000, dateCreated: 1520553600000, priority: "Норма", workshop:"Цех 2"},
    {position: 4, name : "РРС РУСИЯ", project : "Бланк №5",   author: 'Beryllium',  manager: "Пушкин Саша",     status: 3,  dateFinished: 1521331200000, dateCreated: 1520467200000, priority: "Норма", workshop:"Цех 2"},
    {position: 5, name : "БЕЛОЧКА",   project : "Бланк №2",   author: 'Boron',      manager: "Синичкина Анна",  status: 4,  dateFinished: 1521072000000, dateCreated: 1520380800000, priority: "Норма", workshop:"Цех 1"},
    {position: 7, name : "ЕЩЕ 1",     project : "Бланк №5",   author: 'Nitrogen',   manager: "Синичкина Анна",  status: 5,  dateFinished: 1520985600000, dateCreated: 1520035200000, priority: "Норма", workshop:"Цех 1"},
    {position: 8, name : "ЕЩЕ 2",     project : "Бланк №4",   author: 'Oxygen',     manager: "Синичкина Анна",  status: 6,  dateFinished: 1521158400000, dateCreated: 1520380800000, priority: "Норма", workshop:"Цех 1"},
    {position: 6, name : "ИП СИДОРОВ",project : "Бланк №4",   author: 'Carbon',     manager: "Птицин Джон",     status: 7,  dateFinished: 1520985600000, dateCreated: 1520035200000, priority: "Норма", workshop:"Цех 2"}
  ];
}
