import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertCategoryPage } from './upsert-category.page';

describe('UpsertCategoryPage', () => {
  let component: UpsertCategoryPage;
  let fixture: ComponentFixture<UpsertCategoryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpsertCategoryPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertCategoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
