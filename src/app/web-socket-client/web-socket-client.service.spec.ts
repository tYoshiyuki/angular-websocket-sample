import { TestBed } from '@angular/core/testing';

import { WebSocketClientService } from './web-socket-client.service';

describe('WebSocketClientService', () => {
  let service: WebSocketClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebSocketClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
