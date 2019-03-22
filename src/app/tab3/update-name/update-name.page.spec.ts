import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateNamePage } from './update-name.page';

describe('UpdateNamePage', () => {
  let component: UpdateNamePage;
  let fixture: ComponentFixture<UpdateNamePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateNamePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateNamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
