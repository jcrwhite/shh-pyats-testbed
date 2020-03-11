import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Device, Connection } from '../models/device';
import { Testbed } from '../models/testbed';
import { TestbedService } from '../testbed.service';
import { AddDeviceComponent } from '../add-device/add-device.component';

@Component({
  selector: 'shh-testbed',
  templateUrl: './testbed.component.html',
  styleUrls: ['./testbed.component.scss']
})
export class TestbedComponent implements OnInit {
  testbed: Observable<Testbed>;

  showNew = false;
  ctxDevice: Device;

  validDevice = false;
  validConnection = false;

  @ViewChild('newDeviceRef', { static: true }) newDeviceRef: AddDeviceComponent;

  constructor(private tbService: TestbedService) {}

  ngOnInit(): void {
    this.testbed = this.tbService.testbed;
    this.testbed.pipe(take(1)).subscribe(tb => {
      if (!tb || Object.keys(tb.devices).length < 1) {
        this.newDevice();
      }
    });
  }

  // Device functions
  newDevice(): void {
    this.ctxDevice = { connections: {} } as Device;
    this.showNew = true;
  }

  addDevice(): void {
    this.tbService.addDevice(this.ctxDevice);
    this.clearCtx();
  }

  clearCtx(): void {
    this.ctxDevice = {} as Device;
    this.newDeviceRef.clear();
  }

  handleNewDeviceChanges(changes: Device): void {
    this.ctxDevice = changes;
  }

  handleDeviceChanges(name: string, device: Device): void {
    this.tbService.updateDevice(name, device);
  }

  removeDevice(device: string): void {
    this.tbService.removeDevice(device);
  }

  deviceKeyUpHandler(e: KeyboardEvent): void {
    if (e.code === 'Enter') {
      e.stopPropagation();
      if (this.validDevice) {
        this.addDevice();
      }
    }
  }

  trackDeviceBy(id: number, device: { key: string; value: object }): string {
    return device.key;
  }

  // Connection functions
  addConnection(): void {}

  handleNewConnectionChanges(changes: Connection): void {
    console.log(changes);
  }

  connectionKeyUpHandler(e: KeyboardEvent): void {
    if (e.code === 'Enter') {
      e.stopPropagation();
      if (this.validConnection) {
        this.addConnection();
      }
    }
  }
}
