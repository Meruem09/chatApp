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
  
}, [])


  return (
    <>
      <div>
        <div>code: {uid}</div>
          <div>
            messages
          </div>
          <div>
            <input type="text" /> <button>send</button>


          </div>
      </div>
    </>

  )
}

export default App
