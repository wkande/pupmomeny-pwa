import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermPage } from './term.page';

describe('TermPage', () => {
  let component: TermPage;
  let fixture: ComponentFixture<TermPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
