import axios from "axios"
import { useState } from "react"

function App() {
  const [message, setMessage] = useState("")
  
  const pingServer = async () => {
    const response = await axios.get("http://127.0.0.1:5032/ping")
    setMessage(response.data.Message)
  }

  return (
    <>
      <h1 className="h-1 text-3xl text-blue-600">This is worker app</h1>
      <button onClick={pingServer}>Ping Server</button>
      {message && <p>Response: {message}</p>}
    </>
  )
}

export default App
