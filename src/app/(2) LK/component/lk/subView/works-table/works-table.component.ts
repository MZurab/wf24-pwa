import {Component, OnInit, SimpleChanges} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'wf24-works-table',
  templateUrl: './works-table.component.html',
  styleUrls: ['./works-table.component.scss']
})
export class WorksTableComponent implements OnInit {

  someObject = {};
  category = {
    'c1'  : 'Широкоформатная печать',
    'c2'  : 'Производства POSM',
    'c3'  : 'Монтажи',
    'c4'  : 'Фрезеровка',
    'c5'  : 'Лазерная резка',
    'c6'  : 'Вакуумная формовка',
    'c7'  : 'Оформление мест продаж',
    'c8'  : 'ROLL UP / РОЛЛ АПЫ',
    'c9'  : 'Пресс воллы',
    'c10' : 'Интерьерная печать',
    'c11' : 'Плоттерная резка',
    'c12' : 'Cветовая реклама'
  };
  showStatus = 1;



  constructor(
    private firestore: AngularFirestore,
    private activateRoute: ActivatedRoute
  ) {
    // set firebase setting
    const settings = {timestampsInSnapshots: true};
    this.firestore.firestore.settings(settings);

    //
    this.activateRoute.queryParams.subscribe( (params: Params ) => {
        this.tableName = (params['table'] === 'article') ? 'article-site1' : 'work-article';
        this.chapterName = (params['table'] === 'article') ? 'Наши статьи' : 'Наши работы';
        //get list from table
        this.getData (1);
      }
    );

  }

  ngOnInit() { }

  // ngOnChanges(iNchanges: SimpleChanges) {
  //   // formId: previousValue  currentValue
  //   console.log('freeform - ngOnChanges 0' , iNchanges);
  //   if (
  //     !iNchanges['modelId'] &&
  //     iNchanges['formId'] &&
  //     iNchanges['formId'].previousValue === undefined &&
  //     !iNchanges['formId'].firstChange
  //   ) {
  //     return true;
  //   }
  //   console.log('freeform - ngOnChanges 1' , this.userId, this.modelId, this.formId);
  //   console.log('freeform - ngOnChanges 2' , iNchanges);
  //   // create form models
  //   this.openPageByIdAndUid ( this.userId, this.modelId, this.formId );
  //
  // }

  ngAfterViewInit () {}

  table       = [];
  tableName   = 'article-site1';
  chapterName;

  changeStatus () {
    this.showStatus = (this.showStatus === 1) ? 3 : 1;
  }
  changeRowStatus (iNrow) {
    const dbId      = iNrow['id'],
          newStatus = iNrow['status'] = (iNrow['status'] === 1) ? 3 : 1,
          pathToDoc = `/users/wideFormat24/table/${this.tableName}/row/${dbId}`;

    this.firestore.firestore.doc(pathToDoc ).update({'status' : newStatus } )

  }

  private async getData (iNstatus = 1) {
    const pathToDCollection = `/users/wideFormat24/table/${this.tableName}/row`;

    console.log('getData - pathToDCollection', pathToDCollection);
    // clear array
    this.table = [];

    return new Promise(
      async (resolve) => {
        try {
          const result = await this.firestore.firestore.collection(pathToDCollection)
            // .where('status', '==', iNstatus)
            .get();
          console.log('firstTable result', result );
          for ( const doc of result.docs) {
            const row = doc.data();
            console.log('firstTable row', row );
            if (row) {
              let chapterName = (this.tableName === 'article-site1') ? 'article' : 'work';//
              let obj = {};
                  obj['date']   = row.date.toMillis(); //new Date().getTime();
                  obj['name']   = row.name;
                  obj['category']   = this.category[row.category];
                  obj['id']     = doc.id;
                  obj['status'] = row.status;
                  obj['cat-href']   = `https://wideformat-site1.firebaseapp.com/${chapterName}/?cat=${row.category}` ;
                  obj['href']   = `https://wideformat-site1.firebaseapp.com/${chapterName}/?docId=${doc.id}` ; // https://wideformat-site1.firebaseapp.com/article?docId=firstTable ttps://site1.wide24

                  this.table.push(obj);
            }
          }
          resolve(true);
        } catch (e) {
          resolve(false);
        }
      }
    );
  }

}
