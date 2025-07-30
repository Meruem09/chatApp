import { useEffect, useRef, useState } from "react"


function App() {
const inputRef = useRef();
const [socket, setSocket] = useState<WebSocket | null>(null);
const [userText, setUserText] =useState<string>();
const [userExist, setUserExist] = useState<boolean>(false);
const [message, setMessage] = useState<{text: string; sender: "me" | "other"}[]>([]);
const uid= '123';

useEffect(()=>{
  const ws = new WebSocket("ws://localhost:8080")
  ws.onopen = () => console.log("Connected");
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if(msg.type === "message"){
      setMessage((prev) => [...prev, {text:msg.text, sender:"other"}])
    }
  }
  ws.onclose = () => {
    console.log("Disconnected");
    setUserExist(false);
  }
  setSocket(ws);

}, [])

const handleSend = () =>{
  socket.send(JSON.stringify({type:"message", text: userText, roomCode: uid}))
  setMessage((prev) => [...prev, {text: userText, sender: "me"}]);
  setUserText('');
}

const handleConnect = () => {
  if(!socket){
    return;
  }
  socket.send(JSON.stringify({type:"join", roomCode:"123" }))
  setUserExist(true);
}



  return (

    <div className="flex items-center justify-center min-h-screen  p-4">
      <div className="w-full max-w-md bg-gray  backdrop-blur-lg  rounded-2xl shadow-lg p-6 sm:p-8">
      <div className="text-pink mb-2">Room code: {uid}</div>
      <div className="flex-1 max-h-64 overflow-auto custom-scrollbar p-2 "> 
        {message.map((msg, idx) => (
          <div
          key={idx}
          className={`px-4 py-2 rounded-xl max-w-xs m-2
            ${msg.sender === "me" && msg.text ? "bg-gray-800 text-white ml-auto" : "bg-gray-500 text-black"}`}
          >
            {msg.text}
          </div>
        ))

        }
      </div>

      <div className="flex flex-col justify-center sm:flex-row gap-2 m-4">
        <input
          ref={inputRef}
          value={userText}
          onChange={(e) => setUserText(e.target.value)}
          type="text"
          placeholder="Enter message"
          className="border p-2 mr-2 "
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
    </div>

  );
}

export default App
