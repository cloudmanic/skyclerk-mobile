import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnapclerkListPage } from './snapclerk-list.page';

describe('SnapclerkListPage', () => {
  let component: SnapclerkListPage;
  let fixture: ComponentFixture<SnapclerkListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnapclerkListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnapclerkListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
