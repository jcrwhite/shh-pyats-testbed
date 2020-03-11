import { Component, OnInit } from '@angular/core';
import { PreviewService } from './preview.service';
import { Device } from './models/device';

@Component({
  selector: 'shh-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private preview: PreviewService) {}

  updateDevice(device: Partial<Device>): void {
    const temp = { [device.name]: device };
    delete device.name;
    this.preview.update(temp);
  }
}
