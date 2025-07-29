import { WebSocketServer} from "ws";

const wss = new WebSocketServer({port:8080});
    let userCount = 0 ;
    {roomCode: [user1, user2]}  

    

wss.on("connection", function(socket){
    userCount++;
    console.log(`Connected user #${userCount}`);

    const handleJoin = () => {
        socket.onopen()
    }


    socket.on("message", (message) => {
        console.log("Message :" + message.toString());
        socket.send(`Message received: ${message.toString()}`)
    })

})