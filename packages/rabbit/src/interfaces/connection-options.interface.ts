export interface ConnectionOptions {
  socketOptions?: any;
  url?: string | {
    frameMax?: number;
    heartbeat?: number;
    hostname?: string;
    locale?: string;
    password?: string;
    port?: number;
    protocol?: string;
    username?: string;
    vhost?: string;
  };
}
