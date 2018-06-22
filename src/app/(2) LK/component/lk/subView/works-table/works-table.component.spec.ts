import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorksTableComponent } from './works-table.component';

describe('WorksTableComponent', () => {
  let component: WorksTableComponent;
  let fixture: ComponentFixture<WorksTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorksTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorksTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
