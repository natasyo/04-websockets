import {WebSocketServer} from "ws"

const wss=new WebSocketServer({port:8080})

wss.on('connection', (ws) => {

        console.log('connection connected')
        ws.send("Server connected")




    ws.on('message', (data) => {
        console.log("Received message");
        ws.send('Message received')
    })

    ws.on('close', (code: any) => {
        console.log('connection disconnected', code)
    })

})

