/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NcComponent } from './nc.component';

describe('NcComponent', () => {
  let component: NcComponent;
  let fixture: ComponentFixture<NcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
