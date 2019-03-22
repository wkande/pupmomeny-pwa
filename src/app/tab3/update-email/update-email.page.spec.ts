import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateEmailPage } from './update-email.page';

describe('UpdateEmailPage', () => {
  let component: UpdateEmailPage;
  let fixture: ComponentFixture<UpdateEmailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateEmailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateEmailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
