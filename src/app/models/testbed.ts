import { Device } from './device';

export interface Testbed {
  name: string;
  alias?: string;
  devices: {
    [propName: string]: Device;
  };
}
