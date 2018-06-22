export class ConnectUserLibrary {
  // for get access to user
  constructor () {
  }

  keyForLocalStorage = 'connect-user';


  getConnectUserData () {
    let result =  localStorage.getItem ( this.keyForLocalStorage ) || "{}";
    console.log('getConnectUserData - JSON, result', JSON, result);
    return JSON.parse(result);
  }
  saveConnectUserData (iNuserData) {
    let objForSave = iNuserData;
    // convert to string
    if (typeof iNuserData === 'object' ) {
      objForSave = JSON.stringify(iNuserData);
    }
    return localStorage.setItem ( this.keyForLocalStorage, objForSave );
  }

  delConnectUserData () {
    let result =  localStorage.removeItem( this.keyForLocalStorage );
  }


  // saveToUserByKey
  saveToUserByKey (iNkey: string, iNvalue): void {
    console.log('saveToUserByKey INVOKE - iNkey, iNvalue', iNkey, iNvalue);
    let key     = iNkey,
        val     = iNvalue,
        ud      = this.getConnectUserData() || {};

    console.log('saveToUserByKey - key, val, ud', key, val, ud);

        ud[key] = val;
    // save user data
    this.saveConnectUserData(ud);
  }
  // getFromUserByKey
  getFromUserByKey (iNkey: string) {
    let key     = iNkey,
        ud      = this.getConnectUserData() || {};
    return ud[key] || null;
  }


  //@< login
    public _login;
    get login () {
      return this.getFromUserByKey('login');
    }
    set login (iNval) {
      this.saveToUserByKey('login', iNval);
    }
  //@> login

  //@< icon
    public _icon;
    get icon () {
      return this.getFromUserByKey('icon');
    }
    set icon (iNval) {
      this.saveToUserByKey('icon', iNval);
    }
  //@> icon

  //@< lastname
    public _lastname;
    get lastname () {
      return this.getFromUserByKey('lastname');
    }
    set lastname (iNval) {
      this.saveToUserByKey('lastname', iNval);
    }
  //@> lastname

  //@> firstname
    public _firstname;
    get firstname () {
      return this.getFromUserByKey('firstname');
    }
    set firstname (iNval) {
      this.saveToUserByKey('firstname', iNval);
    }
  //@> firstname

  //@< display name
    public _displayName;
    get displayName () {
      return this.getFromUserByKey('display_name');
    }
    set displayName (iNval) {
      this.saveToUserByKey('display_name', iNval);
    }
  //@> display name


  //@< authType
    public _authType;
    get authType () {
      return this.getFromUserByKey('authType');
    }
    set authType (iNval) {
      this.saveToUserByKey('authType', iNval);
    }
  //@> display name

  // token
    public _token;
    get token () {
      return this.getFromUserByKey('token');
    }
  // token

  // saveToken
  public saveToken (iNtoken: string): void {
    let ud      = this.getConnectUserData() || {};
    ud['token'] = iNtoken;
    // save user data
    this.saveConnectUserData(ud);
  }

  /*
    user
      icon
      login
      dislplay_name
      token
      firstname
      lastname
      user
      authType
   */
}
