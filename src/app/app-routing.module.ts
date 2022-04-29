import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TodoGridListComponent } from './components/todo-grid-list/todo-grid-list.component';
import {HttpClientModule} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';

const routes: Routes = [
  {path:'',component:TodoGridListComponent}
];

@NgModule({
  declarations:[
    TodoGridListComponent
  ],
  imports: [
    HttpClientModule,
    ReactiveFormsModule,
    BrowserModule,
    CommonModule,
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule,HttpClientModule,CommonModule,BrowserModule,ReactiveFormsModule]
})
export class AppRoutingModule { }
