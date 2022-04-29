import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoGridListComponent } from './todo-grid-list.component';

describe('TodoGridListComponent', () => {
  let component: TodoGridListComponent;
  let fixture: ComponentFixture<TodoGridListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TodoGridListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoGridListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
