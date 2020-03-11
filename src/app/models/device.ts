export interface Device {
  name?: string;
  // below are actual device fields
  alias?: string;
  os: string;
  platform?: string;
  connections: {
    [propName: string]: Connection;
  };
}

export interface Connection {
  name?: string;
  // below are actual connection fields
  alias?: string;
  class?: string;
  via?: string;
}
