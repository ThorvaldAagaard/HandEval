import { TestBed } from '@angular/core/testing';

import { TricktakingsourceService } from './tricktakingsource.service';

describe('TricktakingsourceService', () => {
  let service: TricktakingsourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TricktakingsourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
