import { TestBed } from '@angular/core/testing';

import { UtilsService } from './utils.service';

describe('Utils.ServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UtilsService = TestBed.get(UtilsService);
    expect(service).toBeTruthy();
  });
});
