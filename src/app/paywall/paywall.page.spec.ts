import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaywallPage } from './paywall.page';

describe('PaywallPage', () => {
  let component: PaywallPage;
  let fixture: ComponentFixture<PaywallPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaywallPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaywallPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
