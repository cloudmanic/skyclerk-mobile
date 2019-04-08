import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAttachmentPage } from './view-attachment.page';

describe('ViewAttachmentPage', () => {
  let component: ViewAttachmentPage;
  let fixture: ComponentFixture<ViewAttachmentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAttachmentPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAttachmentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
