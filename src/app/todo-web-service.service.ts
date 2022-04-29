import { Todo } from 'src/app/Models/Todo';
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

// import {Todo} from './Models/Todo';

/**
 * @description : this file should work as service  .. do all the crud operations that the user will need
 */

import serverConfigures from './configs/client_config';
import { tap } from 'rxjs';
import { PubSub } from './utils/pubsub';
import { UserService } from './userAuth.service';

@Injectable({
  providedIn: 'root',
})
export class TodoWebServiceService extends PubSub<any | boolean | Error> {
  constructor(
    private httpClient: HttpClient,
    private userAuthService: UserService
  ) {
    super();
    this.userAuthService.on('isUserLogged', (data: boolean) => {
      if (data === true) {
        let result = window.localStorage.getItem('userData');
        let userProfile = JSON.parse(result!);
        this.emit('userProfile', userProfile); //emit user profile
      } else {
        this.emit('userProfile', null); // emit user profile null to update the client state
      }
    });
  }

  //the client need to ask the server for his / her todos
  //get all the todos and it will get also the user profile
  getTodos(authState: boolean) {
    if (authState) {
      this.emit('loading', true);
      this.httpClient
        .get<any>(`${serverConfigures.serverURL}/todos`, {
          headers: {
            'x-auth-token': window.localStorage.getItem('userToken') ?? '',
          },
        })
        .pipe(
          tap((response) => {
              
          })
        )
        .subscribe({
          next: (response) => {
            this.emit('loading', false);
            this.emit('emptyData', false); // not having empty data
            if (response.data.length !== 0) {
              //the array is filled with data
              this.emit('emptyData', false); // not having empty data
              this.emit('onData', response.data); // load the data to the client
            } else {
              this.emit('onData', response.data); // load the empty data for the client
              this.emit('emptyData', true); // emit a empty state for the client
            }
          },
          error: (err) => {
            this.emit('loading', false);
            this.emit(
              'loadingError',
              new Error('Loading user Data Ended with error')
            );
          },
          complete: () => {
            this.emit('loading', false);
          },
        });
    } else {
      this.emit('onData', []); // load the empty data for the client
      this.emit('emptyData', false); // emit a empty state for the client
      this.emit('authenticationError', true);
      this.emit('loading', false);
    }
  }

  addTodos(value:any){

    //control the states of loading and adding etc .
    //call the get todos after getting result from the server

    this.httpClient.post<any>(`${serverConfigures.serverURL}/todos`,{
      title:value!.title,
      description:value!.description,
      colorTheme:value!.colorTheme
    },{
      headers : {
        'x-auth-token': window.localStorage.getItem('userToken') ?? '',
      }
    }).pipe(tap((response:any)=>{
        
    })).subscribe({
      next : (value:any)=>{
        //not interesting about it

      },
      complete : ()=>{
        this.getTodos(true);
      },
      error : (err)=>{
        //throw error to the client to update the state
      }
    })


  }

  /**
   *
   * @param value id
   */
  deleteTodo(value:any){

    //control the states of loading and adding etc .
    //call the get todos after getting result from the server

    this.httpClient.delete<any>(`${serverConfigures.serverURL}/todos/${value}`,{
      headers : {
        'x-auth-token': window.localStorage.getItem('userToken') ?? '',
      }
    }).pipe(tap((response:any)=>{
        
    })).subscribe({
      next : (value:any)=>{
        //not interesting about it

      },
      complete : ()=>{
        this.getTodos(true);
      },
      error : (err)=>{
        //throw error to the client to update the state
      }
    })


  }


  editTodo(value:any , id:any){

    //control the states of loading and adding etc .
    //call the get todos after getting result from the server

    this.httpClient.put<any>(`${serverConfigures.serverURL}/todos/${id}`,{
      title:value!.title,
      description:value!.description,
      colorTheme:value!.colorTheme
    },{
      headers : {
        'x-auth-token': window.localStorage.getItem('userToken') ?? '',
      }
    }).pipe(tap((response:any)=>{
        
    })).subscribe({
      next : (value:any)=>{
        //not interesting about it

      },
      complete : ()=>{
        this.getTodos(true);
      },
      error : (err)=>{
        //throw error to the client to update the state
      }
    })


  }



}
