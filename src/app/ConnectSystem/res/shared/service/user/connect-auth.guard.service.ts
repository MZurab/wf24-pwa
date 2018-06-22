import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {ConnectAuthService} from './connect-auth.service';
import {Observable, Observer} from 'rxjs';

@Injectable()
export class ConnectAuthGuardService implements CanActivate {
  constructor (
    private auth: ConnectAuthService,
    private router: Router
  ) {

  }

  canActivate (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    console.log('route.component - '      , route.component );
    console.log('route.url - '            , route.url );
    console.log('route.url.toString() - ' , route.url.toString() );
    console.log('route.outlet - '         , route.outlet );
    console.log('state.url - '            , state.url );

    return Observable.create(
      (observer: Observer<boolean>) => {
        this.auth.isLogined().subscribe(
          (authed) => {
            console.log('canActivate - authed, route.url.toString()', authed, route.url.toString());
            if ( route.url.toString() === 'login' ) {
              // if loging -> get access if we not signed
              if ( !authed ) {
                observer.next(true);
                observer.complete();
                return;
              } else {
                // if we auther -> go to lk
                this.router.navigate(['/lk']);
              }
            } else {
              // if we are not want to get login page -> get access if we signed
              if ( authed ) {
                observer.next(true);
                observer.complete();
                return;
              } else {
                // if we auther -> go to lk
                this.router.navigate(['/login']);
              }
            }

            // get
            observer.next(false);
            observer.complete();

          }
        );
      }
    );
  }

}
