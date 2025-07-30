import {WebSocket, WebSocketServer} from "ws";

const wss = new WebSocketServer({port:8080});

type RoomMap = {
  [roomCode: string]: WebSocket[];
};
// In-memory room storage
const rooms: RoomMap = {};
let userCount = 0;

wss.on("connection", function(socket){

    userCount++;
    console.log(`Connected user #${userCount}`);

    socket.on("message", (data: string) => {
        try{
            const msg = JSON.parse(data);
            if(msg.type === 'join'){
                const {roomCode} = msg;

                if(!rooms[roomCode]){
                    rooms[roomCode] = [socket];
                    (socket as any).roomCode = roomCode;
                    socket.send(JSON.stringify({type:'status', message:'Waiting for another user...'}))
                }
                else if(rooms[roomCode].length === 1){
                    rooms[roomCode].push(socket);
                    (socket as any).roomCode = roomCode;
                    rooms[roomCode].forEach((userSock) => {
                        userSock.send(JSON.stringify({type:'status', message:'One user joinded'}));
                    });
                
                }
                else{
                    socket.send(JSON.stringify({type:'error', message:"Room full"}))
                }
            }
            else if(msg.type === 'message'){
                const { roomCode, text } = msg;
                const participant = rooms[roomCode];

                if(participant){
                    rooms[roomCode].forEach(userSock => {
                        if(userSock !== socket){
                            userSock.send(JSON.stringify({type:'message', text}))
                        }
                    })
                }
            }
        }catch (err) {
            console.error("❌ Invalid message received:", err);
            socket.send(JSON.stringify({ type: "error", message: "Bad message format" }));
        }

    })

    socket.on("close", () => {
        const roomCode = (socket as any).roomCode;
        if(roomCode && rooms[roomCode]){
            rooms[roomCode] = rooms[roomCode].filter(r => r !== socket)
        }
        if(rooms[roomCode].length === 0){
            delete rooms[roomCode];
            console.log(`Deleted room: ${roomCode}`);
        }
    })

})