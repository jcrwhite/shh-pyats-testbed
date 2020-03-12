import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Device, Connection } from '../models/device';
import { Testbed } from '../models/testbed';
import { TestbedService } from '../testbed.service';
import { AddDeviceComponent } from '../add-device/add-device.component';
import { AddConnectionComponent } from '../add-connection/add-connection.component';

@Component({
  selector: 'shh-testbed',
  templateUrl: './testbed.component.html',
  styleUrls: ['./testbed.component.scss']
})
export class TestbedComponent implements OnInit {
  testbed: Observable<Testbed>;

  showNew = false;
  ctxDevice: Device;
  ctxConnection: Connection;

  validDevice = false;
  validConnection = false;

  @ViewChild('newDeviceRef', { static: true }) newDeviceRef: AddDeviceComponent;
  @ViewChild('newConnectionRef', { static: true }) newConnectionRef: AddConnectionComponent;
  @ViewChild('connectionRef', { static: false }) connectionRef: AddConnectionComponent;

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
    this.clearNewConnectionCtx();
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
  newConnection(): void {
    this.ctxConnection = {};
  }

  addConnection(device: string): void {
    this.tbService.addConnection(device, { ...this.ctxConnection });
    this.clearConnectionCtx();
  }

  addNewConnection(): void {
    const { name, ...data } = this.ctxConnection;
    if (!this.ctxDevice.connections) {
      this.ctxDevice.connections = {};
    }
    this.ctxDevice.connections[name] = data;
    this.clearNewConnectionCtx();
  }

  removeNewConnection(name: string): void {
    if (this.ctxDevice.connections) {
      delete this.ctxDevice.connections[name];
    }
  }

  clearNewConnectionCtx(): void {
    this.ctxConnection = {};
    this.newConnectionRef.clear();
  }

  clearConnectionCtx(): void {
    this.ctxConnection = {};
    this.connectionRef.clear();
  }

  handleNewConnectionChanges(changes: Connection): void {
    this.ctxConnection = changes;
  }

  handleNewConnectionEdit(name: string, changes: Connection): void {
    if (!this.ctxDevice.connections) {
      return;
    }
    this.ctxDevice.connections[name] = changes;
  }

  handleConnectionsChanges(device: string, name: string, changes: Connection): void {
    this.tbService.updateConnection(device, { name, ...changes });
  }

  removeConnection(device: string, name: string): void {
    this.tbService.removeConnection(device, name);
  }

  connectionKeyUpHandler(e: KeyboardEvent, device?: string): void {
    if (e.code === 'Enter') {
      e.stopPropagation();
      if (this.validConnection) {
        if (device) {
          this.addConnection(device);
        } else {
          this.addNewConnection();
        }
      }
    }
  }

  trackConnectionBy(id: number, connection: { key: string; value: object }): string {
    return connection.key;
  }
}
