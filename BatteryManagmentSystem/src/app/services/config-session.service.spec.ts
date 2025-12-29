import { TestBed } from '@angular/core/testing';

import { ConfigSessionService } from './config-session.service';

describe('ConfigSessionService', () => {
  let service: ConfigSessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigSessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
