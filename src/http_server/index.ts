import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import {Player} from '../websocket/Player'

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
wsServer.on('connection', (ws) => {
    ws.onmessage = (msg) => {
        console.log(msg.data)
        const data = JSON.parse(msg.data as string, (key, value) => value);
        const userData = JSON.parse(data.data)
        console.log(data);
        if(data.type === 'reg'){
            const user = new Player(userData.name, userData.password)
            const res = JSON.stringify({
            type: "reg",
            data: JSON.stringify({
                    name: user.name,
                    index: 0,
                    error: false,
                    errorText: "string",
                }),
                
            id: 0,
        })
        ws.send(res);
        const res2 = JSON.stringify({
            type: "update_room",
            data: JSON.stringify(
                
                    [
                        {
                            roomId: 0,
                            roomUsers:
                                [{
                                    name: 0,
                                    index: 0,
                                }],
                        },
                    ]
                
                ),
                
            id: 0,
        })
        ws.send(res2)



        }else if (data.type === 'create_room') {
            const res = JSON.stringify({
                type: "create_game",
                data: JSON.stringify({
                    idGame: 1,
                    idPlayer: 2,
                }),
                    
                id: 0,
            })
            ws.send(res)
        } else {
            const res = JSON.stringify({
                type: "update_room",
                data: JSON.stringify(
                    
                        [
                            {
                                roomId: 0,
                                roomUsers:
                                    {
                                        name: 0,
                                        index: 0,
                                    },
                            },
                        ]
                    
                    ),
                    
                id: 0,
            })
            ws.send(res)
        }
        
    }
})
// const ws = new WebSocket();
// ws.onmessage = (msg) => {
//     console.log(msg)
// }