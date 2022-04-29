import { LoadedUserAuthData, LoadingUserAuthData, UserAuthState, UserAuthStateLoggedOutSuccessfully } from './appStates/AppStates';
import { GoogleSigninService } from './google-signin.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UserService } from './userAuth.service';
import { TodoWebServiceService } from './todo-web-service.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'TodoApp';

  isLoading = false;

  loading:UserAuthState | null = null;

  isLogged = false;

  userProfile : any | null = null;

  user:gapi.auth2.GoogleUser | null = null;
  /**
   *
   */
  constructor(private todoWebService:TodoWebServiceService,private userLoginService:UserService,private googleSignInService:GoogleSigninService,private detectionRef:ChangeDetectorRef) {
    this.todoWebService.on('userProfile',(data:any)=>{
      this.userProfile = data;
      this.detectionRef.detectChanges();
    })
    this.userLoginService.on("isUserLogged",(state:boolean)=>{
        this.isLogged = state;
        this.detectionRef.detectChanges();
    })
    this.googleSignInService.on("loading",(data:LoadingUserAuthData)=>{
        this.loading = data;
        this.detectionRef.detectChanges();
      });
    this.googleSignInService.on("loaded",(data:LoadedUserAuthData)=>{
        this.user = data.user ?? null;
        this.loading = null;
        this.detectionRef.detectChanges();

      });
      this.googleSignInService.on("LoggedOut",(data:UserAuthStateLoggedOutSuccessfully)=>{
          this.user = data.user;
          this.detectionRef.detectChanges();

    });
  }

  ngOnInit(): void {

    this.isLogged = this.userLoginService.isLogged ?? false;

    //check the user profile on refresh
    let result = window.localStorage.getItem('userData');

    this.userProfile = JSON.parse(result!);
    this.detectionRef.detectChanges();


  }

  signIn(){
    this.googleSignInService.signin();

  }

  signOut(){
    this.googleSignInService.signout();
  }



}

