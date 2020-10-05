import { TestBed } from '@angular/core/testing';

import { AppUpdateServiceService } from './app-update-service.service';

describe('AppUpdateServiceService', () => {
  let service: AppUpdateServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppUpdateServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
