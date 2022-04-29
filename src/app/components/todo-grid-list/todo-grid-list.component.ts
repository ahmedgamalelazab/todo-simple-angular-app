import { TodoWebServiceService } from './../../todo-web-service.service';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/userAuth.service';
import {FormControl,FormGroup,Validators , FormBuilder} from '@angular/forms';
import { GoogleSigninService } from 'src/app/google-signin.service';
import * as $ from 'jquery';
import * as bootstrap from 'bootstrap';
// import { GoogleSigninService } from 'src/app/google-signin.service';
// import { Todo } from 'src/app/Models/Todo';

/**
 * @description : this component should just react to the service .. that carries the state of the user
 * @conditions : if the user is logged in for example the component should talk to a service to grap the data for him and start do the process and display the data on the screen
 * @missions : we need to update the ui when we have data and on loading and no data
 */

// declare let bootstrap : any;

@Component({
  selector: 'app-todo-grid-list',
  templateUrl: './todo-grid-list.component.html',
  styleUrls: ['./todo-grid-list.component.scss'],
})
export class TodoGridListComponent implements OnInit , AfterViewInit {
  isLoading = false;
  todoList: any[] = [];
  isEmptyData = true;
  authenticationError = false;
  userForm:FormGroup|undefined;
  @ViewChild('myname') input:ElementRef | undefined;
  myModalForm:Element | undefined;
  loadingg = true;
  currentSelected:any;
  currentMode = "adding";

  constructor(
    private fb:FormBuilder,
    private detectChangesRef: ChangeDetectorRef,
    private todoListService: TodoWebServiceService,
    private userAuthService: UserService,
    private googleSignInService:GoogleSigninService
  ) {
    this.userAuthService.on('isUserLogged', (data: boolean) => {
      this.authenticationError = data;
      this.detectChangesRef.detectChanges();
      this.todoListService.getTodos(this.authenticationError);
    });
    //registering on loading state
    this.todoListService.on('loading', (data: boolean) => {
      this.isLoading = data;
      this.detectChangesRef.detectChanges();
    });
    //registering data state
    this.todoListService.on('emptyData', (data: boolean) => {
      this.isEmptyData = data;
      this.detectChangesRef.detectChanges();
    });
    //registering on data pass successfully
    this.todoListService.on('onData', (data: any) => {
      this.todoList = data; // [] empty if user is auth off
      this.detectChangesRef.detectChanges();
      // new bootstrap.Modal(this.myModalForm!).dispose();
      this.currentMode = "adding";
      // window.location.reload();
    });
  }
  ngAfterViewInit(): void {
      
  }

  ngOnInit(): void {

    //initializing the form
    this.userForm = this.fb.group({
      title:'',
      description:'',
      colorTheme:''
    })

    //start listen for the service that register the user loggin state
    if (window.localStorage.getItem('userToken')) {
      this.todoListService.getTodos(true);
    } else {
      //don't
      this.todoListService.getTodos(false);
    }
    //start listen for the service that register the user loggin state
  }

  //add todo
  addTodo(){
      
    this.todoListService.addTodos(this.userForm!.value);
    // new bootstrap.Modal(this.input!.nativeElement).dispose();
   

    // myModal.dispose();
  }

  displayMessage(){
    //control the form from bootsrap
    if(window.localStorage.getItem('userToken')){
      //display the modal
        
      this.userForm?.reset();
      this.currentMode = "adding";
      new bootstrap.Modal(this.input!.nativeElement).show();
    }else{
      this.googleSignInService.signin();
    }
  }

  deleteTodo(todo:any){
      
    this.todoListService.deleteTodo(todo!._id);
  }

  showEditMessage(todo:any){
      
    this.currentMode = "editing";
    this.userForm?.get('title')?.setValue(todo!.title);
    this.userForm?.get('description')?.setValue(todo!.description);
    this.userForm?.get('colorTheme')?.setValue(todo!.colorTheme);
    new bootstrap.Modal(this.input!.nativeElement).show();
    this.currentSelected = todo;
  }

  editTodo(){
      this.todoListService.editTodo(this.userForm?.value , this.currentSelected._id);
      
  }

}
