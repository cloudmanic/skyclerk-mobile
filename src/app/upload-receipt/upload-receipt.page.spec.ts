import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadReceiptPage } from './upload-receipt.page';

describe('UploadReceiptPage', () => {
  let component: UploadReceiptPage;
  let fixture: ComponentFixture<UploadReceiptPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadReceiptPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadReceiptPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
