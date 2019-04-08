import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLedgerPage } from './edit-ledger.page';

describe('EditLedgerPage', () => {
  let component: EditLedgerPage;
  let fixture: ComponentFixture<EditLedgerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditLedgerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLedgerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
