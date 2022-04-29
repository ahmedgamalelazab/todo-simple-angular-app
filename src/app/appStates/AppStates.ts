
/**
 * @description : some states will carry data and some states will not carry any kind of data
 */


//user Auth states
export interface UserAuthState{}

export class LoadingUserAuthData implements UserAuthState{}
/**
 * @description : user data is loaded up from google
 */
export class LoadedUserAuthData implements UserAuthState{
  public user:gapi.auth2.GoogleUser | undefined;
    constructor(user:gapi.auth2.GoogleUser){
        this.user = user;
        window.localStorage.setItem('userData',JSON.stringify({
            userName:user.getBasicProfile().getName(),
            userEmail:user.getBasicProfile().getEmail(),
            userImage:user.getBasicProfile().getImageUrl(),
        }))
    }

}
export class LoadingUserAuthDataFailure implements UserAuthState{
  public error:Error | undefined | any;
  constructor(error:Error | any){
    this.error = error;
  }
}

//^handling the authentication states logged in logged out

export class UserAuthStateLoggedInSuccessfully implements UserAuthState{
  //control the internal storage
  constructor(data:any){
    window.localStorage.setItem('userToken',JSON.stringify(data));
  }
}

export class UserAuthStateLoggedOutSuccessfully implements UserAuthState{
  user:gapi.auth2.GoogleUser | null = null;
  constructor(){
    this.user = null;
    window.localStorage.clear();
  }
}

// export class LoadingUserAuthData implements UserAuthState{}





