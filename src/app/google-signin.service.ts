import { UserAuthState, LoadingUserAuthDataFailure, LoadingUserAuthData, LoadedUserAuthData, UserAuthStateLoggedOutSuccessfully } from './appStates/AppStates';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import serverConfigures from './configs/client_config';
// grap our pubsub here

import {PubSub} from './utils/pubsub';
import { UserService } from './userAuth.service';
@Injectable({
  providedIn: 'root',
})
export class GoogleSigninService extends PubSub<UserAuthState> {
  private auth2: gapi.auth2.GoogleAuth | undefined;

  // private subject = new ReplaySubject<gapi.auth2.GoogleUser | null>(1); // angular reactive programming object subject

  constructor(private userAuthService:UserService) {
    super(); // the super will now initialize the events
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id:
          '369882629048-p6epfaahs22g1faih12d1n0nr8h288k1.apps.googleusercontent.com',
      });
    });
  }

  //handle the login state
  public signin() {
    this.emit("loading", new LoadingUserAuthData());
    this.auth2
      ?.signIn()
      .then(async(user) => {
        try{
          await this.userAuthService.LogUser(user);
          this.emit("loaded",new LoadedUserAuthData(user));
          this.emit("loading",false);
        }catch(error){
          this.emit("Error",new LoadingUserAuthDataFailure(error)); //passing nulls values when logging has error
        }
      })
      .catch((error) => {
        // this.subject.next(null);
        this.emit("Error",new LoadingUserAuthDataFailure(error)); //passing nulls values when logging has error

      });
  }

  public signout() {
    this.auth2?.signOut().then(() => {
      // this.subject.next(null);
      //state of the user has logged out from the client app
      //u can delay the user a little bit if u wanted to
      this.userAuthService.logOutUser();
      this.emit("LoggedOut",new UserAuthStateLoggedOutSuccessfully());
      // window.localStorage.clear();
    });
  }

  // public observable(): Observable<gapi.auth2.GoogleUser | null> {
  //   return this.subject.asObservable();
  // }
}


/**
 * //the user sign in
 *      extra code ...
        this.httpClient.post<any>(`${serverConfigures.serverURL}/client/login`, {
          googleId: `${user.getBasicProfile().getId()}`,
          email: `${user.getBasicProfile().getEmail()}`,
          image: `${user.getBasicProfile().getImageUrl()}`,
          firstName: `${user.getBasicProfile().getGivenName()}`,
          lastName: `${user.getBasicProfile().getFamilyName()}`,
          fullName: `${user.getBasicProfile().getName()}`,
        },
        ).pipe(tap((response)=>{
          console.log(response)
        })).subscribe({
          next : (value)=> {
            //the value will be representing status of the request + the jwt token that the user will ask for it ..
              console.log(value);
              window.localStorage.setItem('userToken',value.jwt);
              // this.subject.next(user);
          },
          error:(err)=> {
              console.log(err);
          },
        })
 */
