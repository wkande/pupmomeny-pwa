import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorsComponent } from './vendors.component';

describe('Vendors.PopoverPage', () => {
  let component: VendorsComponent;
  let fixture: ComponentFixture<VendorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorsComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
