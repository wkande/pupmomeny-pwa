import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertWalletPage } from './upsert-wallet.page';

describe('UpsertWalletPage', () => {
  let component: UpsertWalletPage;
  let fixture: ComponentFixture<UpsertWalletPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpsertWalletPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertWalletPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
