import {Component, OnInit, ViewChild} from '@angular/core';
import {ConnectAuthService} from '../../../ConnectSystem/res/shared/service/user/connect-auth.service';
import {Router} from '@angular/router';
// import {MatSort, MatTableDataSource} from '@angular/material';

// import * as moment from 'moment';

//set ru locale
// moment.locale('ru');



@Component({
  selector: 'wf24-lk',
  templateUrl: './lk.component.html',
  styleUrls: ['./lk.component.scss']
})
export class LkComponent implements OnInit {

  constructor(
    private auth: ConnectAuthService,
    private route: Router
  ) { }
  // we add firstname here
    userName = this.auth.user.firstname;
  // later we add time interval id here
    timeIntervalId;
  // later we add timer here
    timeNow;

  ngOnInit() {
    // set initial time
      this.timeNow = new Date().getTime();
    // live update time
      this.timeIntervalId = setInterval(
        () => {
          this.timeNow = new Date().getTime();

        },
        1000
      )
  }
  ngOnDestroy() {
    // delete time interval
      if(this.timeIntervalId) {
        clearInterval(this.timeIntervalId);
      }
  }



  ngAfterViewInit () {
  }

  signOut() {
    this.auth.signOut(
      ( result: boolean ) => {
        if ( result ) {
          // sign out -> navigate to login page
          this.route.navigate(['/login'] );// { 'queryParams' : { 'test' : 'true' } , fragment: 'true'  }
        }
      }
    );
  }
}
