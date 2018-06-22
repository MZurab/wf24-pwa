import {FreeformModel} from './model/freeform.model';
import {Observable, Observer} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {FreeformCommonService} from './_sub/freeform.common.service';
import {FreeformPageService} from './_sub/freeform.page.service';
import {ConnectAuthService} from '../user/connect-auth.service';
import {ActivatedRoute, Router} from '@angular/router';



@Injectable()
export class FreeformService {


  // someVariable: FreeformModel;


  constructor (
    private http:   HttpClient,
    public  common: FreeformCommonService,
    private pages:  FreeformPageService,
    private auth: ConnectAuthService,

    private _route: ActivatedRoute,
    private _router: Router
  ) {



  }

  async getForm (iNuserId, iNmodelId, iNformId = null, iNcallback) {
    // update form to firebase
    let uid       = FreeformCommonService.userId = iNuserId,
      callback    = iNcallback,
      modelId     = FreeformCommonService.formModelId = iNmodelId,
      formId      = FreeformCommonService.formId = iNformId,
      err         = false, // default - we have no error
      myUid       = await this.auth.getUserIdByPromise(),
      token       = this.auth.user.token,
      url         = (formId) ? `https://ramman.net/api/service/freeform/get/${uid}/${modelId}?formId=${formId}&uid=${myUid}&token=${token}` : `https://ramman.net/api/service/freeform/create/${uid}/${modelId}?uid=${myUid}&token=${token}&getForm=1`;
      // `https://ramman.net/api/service/freeform/get/${uid}/${modelId}?formId=${formId}&uid=${myUid}&token=${token}`;

      this.http.get(url).subscribe (
        (data) => {

          console.log( 'getForm - url, data' , url, data );

          if ( typeof callback === 'function' ) {

            let formData = data;

            if ( !formData || formData['status'] !== 1) {
              // if we have not object -> set result to true -> invoke callback
                err = true;
            } else if ( formData['formId'] && formId !== formData['formId'] ) {
              // we created form -> ser form id
                formId = FreeformCommonService.formId = formData['formId'];
              // change get url
                this.addUrlParams({ 'formid' : formData['formId'] } );
            }

            if ( typeof callback === 'function' ) {
              // invoke callback
              callback(err, formData['form'], formId);
            }

          }
        }
      );
  }

  addUrlParams (iNqueryParams) {
    // changes the route without moving from the current view or
    // triggering a navigation event
    this._router.navigate([], {

      relativeTo: this._route,

      queryParams: iNqueryParams,

      queryParamsHandling: 'merge',
      // preserve the existing query params in the route
      skipLocationChange: false
      // do not trigger navigation
    });
  }

  // getPageFromLocal ( iNuid: string = 'test', iNformId: string, iNobjId: string) {
  //
  //   var o1 = Observable.from([{a: 1, b: 2, c: 3}]);
  //
  //   let uid = iNuid, objId = iNobjId, formId = iNformId;
  //
  // }

  getPageByIdAndUid ( iNuid: string, iNmodelId: string, iNformId: string ): Observable<FreeformModel> {
    /*
      @discr
        Получение модели с url запросом
    */

    let formid  = iNformId,
        modelid = iNmodelId,
        uid     = iNuid;

    return Observable.create (
      (observer: Observer<FreeformModel>) => {
        // let urlHost = 'http://localhost:3000/'; // http://192.168.1.137:3000/ 'http://localhost:3000/';
        // let url: string = urlHost + `users/${iNuid}/freeform?id=${iNid}`;

        this.getForm ( //this.common.getForm
          uid,
          modelid,
          formid,
          async (iNerr, inForm, iNformId) => {
            let err     = iNerr,
                form    = inForm,
                formId  = iNformId;


            if ( err ) { // err || form['status']
              // if we have err ->
              observer.error("Not access");

            } else {
              // if we have not err -> open form

              // init freefom
              await this.init(form);

              observer.next(form);
              observer.complete();
            }
          }
        );
      }
    );
  }

  setFreeformForSingleton (iNfreeform) {
    this.common.freeform = iNfreeform;
  }

  init (iNfreeform) {
    console.log( 'copy init ' );
    //set freeform for later access
    this.setFreeformForSingleton(iNfreeform);

    this.pages.init();

    //**LATER delete NOT NEED
    window['FreeformCommonService'] = FreeformCommonService;



  }

}


