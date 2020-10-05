import { TestBed } from '@angular/core/testing';

import { KaplanrubenService } from './kaplanruben.service';

describe('KaplanrubenService', () => {
  let service: KaplanrubenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KaplanrubenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
