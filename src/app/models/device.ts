export interface Device {
  name: string;
  alias?: string;
  os: string;
  platform?: string;
  connections: {
    [propName: string]: Connection;
  };
}

export interface Connection {
  name: string;
  alias?: string;
  class?: string;
  via?: string;
}
