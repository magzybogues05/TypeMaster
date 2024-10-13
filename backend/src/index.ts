import express from 'express'
import { WebSocket, WebSocketServer } from 'ws'
import { GameManager } from './GameManager';

const app = express()
const httpServer = app.listen(8080)

const wss = new WebSocketServer({ server: httpServer });
const gameManager=new GameManager();
wss.on('connection', function connection(ws) {
    gameManager.addUser(ws);
    ws.on('disconnect',()=>{
      gameManager.removeUser(ws);
    })

  ws.send('Hello! Message From Server!!');
});

app.get('/',(req,res)=>{
    res.send("hello from upcoming typing platform");
})