import { TestBed } from '@angular/core/testing';

import { TodoWebServiceService } from './todo-web-service.service';

describe('TodoWebServiceService', () => {
  let service: TodoWebServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodoWebServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
