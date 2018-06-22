import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConnectUserLibrary} from './connect-user.library';

//< - firestore
import { AngularFireAuth } from 'angularfire2/auth';
import {Observer, Observable} from 'rxjs';
//> - firestore

@Injectable()
export class ConnectAuthService {
  constructor (
    private http: HttpClient,
    private fauth: AngularFireAuth
  ) {

  }

  url_forAuth     = 'https://ramman.net/api/web/sign';
  url_forCheckSms = this.url_forAuth;
  public user     = new ConnectUserLibrary();

  public authByLoginAndPsw ( iNlogin: string, iNpswd: string, iNcallback, iNmoveType: boolean = false ) {
    console.log('authByLoginAndPsw INVOKE - iNlogin, iNpswd', iNlogin, iNpswd);
    const callback  = iNcallback,
      moveType  = iNmoveType,
      pswd      = iNpswd,
      login     = iNlogin,
      body      = {
        'user'      : login,
        'pswd'      : pswd,
        'moveType'  : (moveType) ? '1' : '0',
        'type'      : 'signin'
      },
      options   = {
        'headers': {
          'Content-Type': 'application/json'
        }
      };

    this.http
      .post (
        this.url_forAuth,
        body,
        options
      ) .subscribe (
      ( response ) => {
        console.log( 'authByLoginAndPsw - response', response );
        let result = false;
        if (
          typeof response === 'object' &&
          response['status'] === 1
        ) {
          // success -> set result to true
          result = true;
          this.user.firstname = response['info']['firstname'];
          this.user.lastname = response['info']['lastname'];
          this.user.icon = response['info']['icon'];
          this.user.displayName = response['displayName'];
          this.user.login = response['user'];
          // save token
          this.user.saveToken( response['token'] );
        }
        if ( typeof  callback === 'function' ) callback(result, response);
      }
    );
    //@< response
    /*
      //@ success response
        {
            "info": {
                "icon": "https://cdn.ramman.net/images/icons/users/zurab.jpg",
                "firstname": "Зураб",
                "lastname": "Магомадов"
            },
            "displayName": "Магомадов Зураб",
            "user": "zurab",
            "token": "80ea88bc-6a91-4e2e-a5e5-9a05b703ac95",
            "status": 1
        }
      //@ error response
        {
          "status": 0
        }
    */
    //@> response
  }


  public sendCodeFromSms (iNcode: string, iNcallback,  iNtoken: string = this.user.token,  iNlogin: string = this.user.login) {
    const callback  = iNcallback,
      token     = iNtoken,
      login     = iNlogin,
      code      = iNcode,
      body      = {
        'user'          : login,
        'aToken'        : null,
        'code'          : code,
        'codeType'      : '',
        'country'       : null,
        'lang'          : 'ru',
        'token'         : token,
        'type'          : 'checkCode'
      },
      options   = {
        'headers': {
          'Content-Type': 'application/json'
        }
      };

    this.http.post(
      this.url_forCheckSms,
      body,
      options
    ) .subscribe (
      ( response ) => {
        console.log( 'sendCodeFromSms - response', response );
        let result = false,
          fkey;
        if (
          typeof response === 'object' &&
          response['status'] === 1
        ) {
          // success -> set result to true
          result = true;
          fkey = response['fkey'];

          //
          console.log( 'sendCodeFromSms 2 - callback', callback );

          this.fauth.auth.signInWithCustomToken(fkey).then(
            () => {
              console.log( 'sendCodeFromSms 3 - then', callback,  this.getUserIdFromFirebase() );
              if ( typeof  callback === 'function' ) callback(result, response);
            }).catch(
            () => {
              console.log( 'sendCodeFromSms 3 - catch', callback );
              result = false;
              if ( typeof  callback === 'function' ) callback(result, response);
            }
          )
        }


      }
    );

  }

  public getUserIdFromFirebase (): Observable<object> {
    return this.fauth.authState;
  }

  public getUserIdByPromise (): Promise<any> {
    return new Promise (
      (resolve) => {
        this.getUserIdFromFirebase().subscribe (
          (user) => {
            let result = (user) ? user['uid'] : null;
            console.log('getUserIdByPromise- user',result);

            resolve( result);
          }
        );
      }
    );
  }

  public isLogined (): Observable<boolean> {
    return Observable.create (
      (observer: Observer<boolean>) => {
        this.getUserIdFromFirebase().subscribe(
          (user) => {
            let isLogined = false;
            if ( user ) {
              // if we have user
              isLogined = true
            }
            observer.next(isLogined);
            observer.complete();
          }
        )
      }
    );
  }

  public signOut (iNcallback ) {
    let callback = iNcallback;

    this.fauth.auth.signOut().then(
      () => {
        this.user.delConnectUserData();
        if (typeof callback === 'function' ) callback(true);
      }
    ).catch(
      () => {
        if (typeof callback === 'function' ) callback(false);
      }
    );
  }




}
