import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnapclerkPage } from './snapclerk.page';

describe('SnapclerkPage', () => {
  let component: SnapclerkPage;
  let fixture: ComponentFixture<SnapclerkPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnapclerkPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnapclerkPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
