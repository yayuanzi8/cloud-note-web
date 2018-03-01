import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeLocationDialogComponent } from './change-location-dialog.component';

describe('ChangeLocationDialogComponent', () => {
  let component: ChangeLocationDialogComponent;
  let fixture: ComponentFixture<ChangeLocationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeLocationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeLocationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
