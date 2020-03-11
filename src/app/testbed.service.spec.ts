import { TestBed } from '@angular/core/testing';

import { TestbedService } from './testbed.service';

describe('TestbedService', () => {
  let service: TestbedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestbedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
