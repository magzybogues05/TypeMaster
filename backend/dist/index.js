"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ws_1 = require("ws");
const GameManager_1 = require("./GameManager");
const app = (0, express_1.default)();
const httpServer = app.listen(8080);
const wss = new ws_1.WebSocketServer({ server: httpServer });
const gameManager = new GameManager_1.GameManager();
wss.on('connection', function connection(ws) {
    gameManager.addUser(ws);
    ws.on('disconnect', () => {
        gameManager.removeUser(ws);
    });
    ws.send('Hello! Message From Server!!');
});
app.get('/', (req, res) => {
    res.send("hello from upcoming typing platform");
});
