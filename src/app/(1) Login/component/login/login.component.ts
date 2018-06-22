import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ConnectAuthService} from '../../../ConnectSystem/res/shared/service/user/connect-auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'wf24-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  constructor (
    private authService: ConnectAuthService,
    private router: Router
  ) { }
  //errorWhenSignIn
  errorWhenSignIn;

  // errorWhenSendSmsCode
  errorWhenSendSmsCode;

  // loader
  showingLoader = false;

  // phone
  phone         = '';

  // password
  pswd          = '';

  // smsCode
  smsCode       = '';

  // showSmsBlock
  showSmsBlock  = false;

  // create angular reactive form
  form = new FormGroup(
    {
      phone: new FormControl(
        '',
        [ Validators.required ]
      ),
      pswd: new FormControl(
        '',
        [Validators.required ]
      )
    }
  );

  formSmsCode = new FormGroup(
    {
      smsCode: new FormControl(
        '',
        [ Validators.required ]
      )
    }
  );

  ngOnInit() {
  }

  signIn () {
    // clear error
    this.errorWhenSignIn = null;
    this.errorWhenSendSmsCode = null;

    console.log('click signIn - this.phone, this.pswd, this.smsCode ', this.phone, this.pswd, this.smsCode );
    this.showLoader();

    this.authService.authByLoginAndPsw(
      this.phone,
      this.pswd,
      (result, response) => {
        console.log('signIn - result, response', result, response);
        if (result) {
          //if we signin  -> show sms code block
          this.showFormForSmsCode();
        } else {
          //if we not signin  -> show error -> show signin block
          this.errorWhenSignIn = { '*': 'Ошибка. Неверный логин или пароль.'};
          this.hideLoader();
        }
      }
    );
  }

  sendSmsCode () {
    // clear error
    this.errorWhenSignIn = null;
    this.errorWhenSendSmsCode = null;
    this.showLoader();

    console.log('click signIn - this.phone, this.pswd, this.smsCode ', this.phone, this.pswd, this.smsCode );
    this.authService.sendCodeFromSms(
      this.smsCode,
      (result) => {
        if ( result ) {
          //if we have signin -> pass to lk
          this.router.navigate(['/lk'], { 'queryParams' : { 'key' : 'vaue' } , fragment: 'here hash'  }  );
        } else {
          //if we have not signin -> show sign in block
          this.errorWhenSendSmsCode = { '*': 'Ошибка. Неверный код из смс.'};
          this.showFormForSignIn();
        }
        console.log('sendSmsCode - result', result);
      }
    );
  }

  showFormForSmsCode () {
    // hide loader
    this.hideLoader();
    // show sms block
    this.showSmsBlock = true;
  }

  showFormForSignIn () {
    // show sign in block
    this.showSmsBlock = false;
  }

  showLoader () {
    // show loader
    this.showingLoader = true;
  }

  hideLoader () {
    // hide loader
    this.showingLoader = false;
  }
}
