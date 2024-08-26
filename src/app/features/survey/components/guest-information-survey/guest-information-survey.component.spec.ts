import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestInformationSurveyComponent } from './guest-information-survey.component';

describe('GuestInformationSurveyComponent', () => {
  let component: GuestInformationSurveyComponent;
  let fixture: ComponentFixture<GuestInformationSurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GuestInformationSurveyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestInformationSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
