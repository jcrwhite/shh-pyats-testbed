import { Injectable } from '@angular/core';
import { Testbed } from './models/testbed';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { PreviewService } from './preview.service';
import { getName } from './models/name';
import { Device, Connection } from './models/device';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TestbedService {
  private tb: Testbed;

  private tbSubject: BehaviorSubject<Testbed> = new BehaviorSubject(null);

  private tbObservable: Observable<Testbed> = this.tbSubject.asObservable();

  get testbed(): Observable<Testbed> {
    return this.tbObservable;
  }

  constructor(private previewService: PreviewService) {
    this.tbObservable.pipe(delay(0)).subscribe(tb => this.previewService.update({ ...tb }));
    this.clear();
  }

  private next(): void {
    this.tbSubject.next({ ...this.tb });
  }

  clear(): void {
    this.tb = {
      name: getName(),
      devices: {}
    };
    this.next();
  }

  // testbed
  updateTestbed(testbed: Partial<Testbed>): void {
    this.tb = {
      ...this.tb,
      ...testbed
    };
    this.next();
  }

  // device
  addDevice(device: Device): void {
    const { name, ...data } = device;
    this.tb.devices[name] = data;
    this.next();
  }

  updateDevice(name: string, device: Device): void {
    this.tb.devices[name] = { ...device, ...{ connections: this.tb.devices[name].connections } };
    this.next();
  }

  removeDevice(name: string): void {
    delete this.tb.devices[name];
    this.next();
  }

  // connection
  addConnection(device: string, connection: Connection): void {
    const { name, ...data } = connection;
    if (!this.tb.devices[device].connections) {
      this.tb.devices[device].connections = {};
    }
    this.tb.devices[device].connections[name] = data;
    this.next();
  }

  updateConnection(device: string, connection: Connection): void {
    this.addConnection(device, connection);
  }

  removeConnection(device: string, name: string): void {
    delete this.tb.devices[device].connections[name];
    this.next();
  }
}
