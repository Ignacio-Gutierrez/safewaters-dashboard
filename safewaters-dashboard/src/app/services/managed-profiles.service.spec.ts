import { TestBed } from '@angular/core/testing';

import { ManagedProfilesService } from './managed-profiles.service';

describe('ManagedProfilesService', () => {
  let service: ManagedProfilesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManagedProfilesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
