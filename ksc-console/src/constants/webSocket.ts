export const CONNECT_STATUS = {
  WEBSOCKET_SUC: 1000,
  WEBSOCKET_CONFIG_ERR: -1001,
  WEBSOCKET_INNER_SRV_ERR: -1002,
  WEBSOCKET_AUTH_ERR: -1003,
  WEBSOCKET_UNKNOWN_ERR: -1004,
}

export enum SOCKET_STATUS {
  SUCCESS = 'Success',
  LOADING = 'Loading',
  FAILED = 'Failed',
  CLOSED = 'Closed',
}

export const DEFAULT_CLOSED_MESSAGE =
  'Websocket is disconnected because there is no interaction for some time'
