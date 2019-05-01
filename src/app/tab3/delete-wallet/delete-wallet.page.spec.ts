import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteWalletPage } from './delete-wallet.page';

describe('DeleteWalletPage', () => {
  let component: DeleteWalletPage;
  let fixture: ComponentFixture<DeleteWalletPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteWalletPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteWalletPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
