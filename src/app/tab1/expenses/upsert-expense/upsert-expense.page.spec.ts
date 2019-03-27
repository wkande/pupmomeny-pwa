import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertExpensePage } from './upsert-expense.page';

describe('UpsertExpensePage', () => {
  let component: UpsertExpensePage;
  let fixture: ComponentFixture<UpsertExpensePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpsertExpensePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertExpensePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
