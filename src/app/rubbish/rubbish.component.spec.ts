import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RubbishComponent } from './rubbish.component';

describe('RubbishComponent', () => {
  let component: RubbishComponent;
  let fixture: ComponentFixture<RubbishComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RubbishComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RubbishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
