import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeGreetingComponent } from './welcome-greeting.component';

describe('WelcomeGreetingComponent', () => {
  let component: WelcomeGreetingComponent;
  let fixture: ComponentFixture<WelcomeGreetingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelcomeGreetingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WelcomeGreetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
