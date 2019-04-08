import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectAnAccountPage } from './select-an-account.page';

describe('SelectAnAccountPage', () => {
  let component: SelectAnAccountPage;
  let fixture: ComponentFixture<SelectAnAccountPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectAnAccountPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectAnAccountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
