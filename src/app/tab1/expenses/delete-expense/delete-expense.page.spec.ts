import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteExpensePage } from './delete-expense.page';

describe('DeleteExpensePage', () => {
  let component: DeleteExpensePage;
  let fixture: ComponentFixture<DeleteExpensePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteExpensePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteExpensePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
