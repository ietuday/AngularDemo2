/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SchedulerServiiceService } from './scheduler-serviice.service';

describe('SchedulerServiiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SchedulerServiiceService]
    });
  });

  it('should ...', inject([SchedulerServiiceService], (service: SchedulerServiiceService) => {
    expect(service).toBeTruthy();
  }));
});
