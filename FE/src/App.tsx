import { useEffect, useRef, useState } from "react"


function App() {
const inputRef = useRef();
const [socket, setSocket] = useState();

const handleSend = () =>{
  if(!socket){
    return;
  }
  //@ts-ignore
  socket.send(inputRef.current.value);
}


useEffect(()=>{
  const ws = new WebSocket("ws://localhost:8080")
  setSocket(ws);
  ws.onmessage = (e) => {
    alert(e.data);
  }
}, [])


  return (
    <>
      <div>
        <input ref={inputRef} type="text" />
        <button onClick={handleSend}>Send</button>
      </div>
    </>

  )
}

export default App
