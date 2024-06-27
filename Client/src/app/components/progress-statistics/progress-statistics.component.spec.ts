import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressStatisticsComponent } from './progress-statistics.component';

describe('ProgressStatisticsComponent', () => {
  let component: ProgressStatisticsComponent;
  let fixture: ComponentFixture<ProgressStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressStatisticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgressStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
