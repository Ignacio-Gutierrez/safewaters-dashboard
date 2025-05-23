import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProfileDialogComponent } from './create-profile-dialog.component';

describe('CreateProfileDialogComponent', () => {
  let component: CreateProfileDialogComponent;
  let fixture: ComponentFixture<CreateProfileDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateProfileDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateProfileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
