"use strict";
const WebSocketServer = require('websocket').server;
const ServerConfig = require('./config/serverConfig');
const HttpServer = require('./httpServer');

const wsServer = new WebSocketServer([{
  ...ServerConfig,
  httpServer: HttpServer()
}]);
