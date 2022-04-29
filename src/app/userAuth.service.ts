
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import serverConfigures from './configs/client_config';
import { PubSub } from './utils/pubsub';

@Injectable({providedIn: 'root'})
export class UserService extends PubSub<boolean>{

  isLogged:boolean|undefined;

  constructor(private httpClient:HttpClient) {
    super();
    if(window.localStorage.getItem('userToken')){
      this.isLogged = true;
      this.emit("isUserLogged",true);
    }else{
      this.isLogged = false;
      this.emit("isUserLogged",false);
    }
  }

  LogUser(user:gapi.auth2.GoogleUser | null){
      return new Promise<boolean | Error>(async (resolve,reject)=>{
        if(user){

          //check for the local storage
          if(window.localStorage.getItem('userToken')){
            this.isLogged = true;
            this.emit("isUserLogged",true);
              resolve(true);
          }

          //send a request to the server telling him that we need to authenticate
        this.httpClient.post<any>(`${serverConfigures.serverURL}/client/login`, {
            googleId: `${user.getBasicProfile().getId()}`,
            email: `${user.getBasicProfile().getEmail()}`,
            image: `${user.getBasicProfile().getImageUrl()}`,
            firstName: `${user.getBasicProfile().getGivenName()}`,
            lastName: `${user.getBasicProfile().getFamilyName()}`,
            fullName: `${user.getBasicProfile().getName()}`,
          },
          ).pipe(tap((response)=>{
              console.log({
                "object":"logging user service",
                "response":response
              });
          })).subscribe({
            next : (response)=>{
              window.localStorage.setItem('userToken',response.jwt);

              this.isLogged = true;
              this.emit("isUserLogged",true);
            }
          })

          resolve(true);
          //register the response from the server [jwt] in the localStorage
        }else{
          reject(new Error('user came with null state'));
          this.emit("isUserLogged",false);
        }
      })
  }

  logOutUser(){
    this.isLogged = false;
    window.localStorage.clear(); // clear the tokens from the localStorage
    this.emit("isUserLogged",false);
  }

}
