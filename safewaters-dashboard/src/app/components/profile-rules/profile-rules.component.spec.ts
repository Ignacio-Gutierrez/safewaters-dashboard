import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileRulesComponent } from './profile-rules.component';

describe('ProfileRulesComponent', () => {
  let component: ProfileRulesComponent;
  let fixture: ComponentFixture<ProfileRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileRulesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
