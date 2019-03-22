import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgComponent } from './msg.component';

describe('MsgPage', () => {
  let component: MsgComponent;
  let fixture: ComponentFixture<MsgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsgComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
