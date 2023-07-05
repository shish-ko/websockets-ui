import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import {Player} from '../websocket/Player'
import { connectionHandler } from '../websocket';

export const httpServer = http.createServer(function (req, res) {
    const __dirname = path.resolve(path.dirname(''));
    const file_path = __dirname + (req.url === '/' ? '/front/index.html' : '/front' + req.url);
    fs.readFile(file_path, function (err, data) {
        if (err) {
            res.writeHead(404);
            res.end(JSON.stringify(err));
            return;
        }
        res.writeHead(200);
        res.end(data);
    });
});



const wsServer = new WebSocketServer({port: 3000, clientTracking: true});
wsServer.on('connection', connectionHandler)
// const ws = new WebSocket();
// ws.onmessage = (msg) => {
//     console.log(msg)
// }