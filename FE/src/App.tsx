import { useEffect, useRef, useState } from "react"


function App() {
const inputRef = useRef();
const [socket, setSocket] = useState<WebSocket | null>(null);
const [userText, setUserText] =useState<string>();
const [userExist, setUserExist] = useState<boolean>(false);
const [message, setMessage] = useState<string>('');
const uid= '123';

const handleSend = () =>{
  socket.send(JSON.stringify({type:"message", text: userText, roomCode: uid}))
  setUserText("");
}

const handleConnect = () => {
  if(!socket){
    
  }
  socket.send(JSON.stringify({type:"join", roomCode:"123" }))
  setUserExist(true);
}

useEffect(()=>{
  const ws = new WebSocket("ws://localhost:8080")
  ws.onopen = () => console.log("Connected");
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    setMessage(msg.text)
  }
  ws.onclose = () => {
    console.log("Disconnected");
    setUserExist(false);
  }
  setSocket(ws);

}, [])


  return (
    <>
      <div className="p-4">
      <div>Room code: {uid}</div>

      <div>You: {userText}</div>
      <div>Anonymous: {message}</div>

      <div className="my-4">
        <input
          ref={inputRef}
          value={userText}
          onChange={(e) => setUserText(e.target.value)}
          type="text"
          placeholder="Enter message"
          className="border p-2 mr-2"
        />
        <button onClick={handleSend} className="bg-blue-500 text-white px-4 py-2 rounded">
          Send
        </button>
      </div>

      <div>
        <button
          onClick={handleConnect}
          className={`px-4 py-2 rounded ${userExist ? "bg-red-500" : "bg-green-500"} text-white`}
        >
          {userExist ? "Disconnect" : "Connect"}
        </button>
      </div>
    </div>
    </>
  );
}

export default App
