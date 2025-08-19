import { Route,Routes } from "react-router-dom"
import Home from "./screens/Home"
import Workers from "./screens/Workers"
import Overlay from "./components/Overlay" //Overlay for sidebar and other components if needed in the future

function App() {

  return (
    <div className="flex gap-8">
    <Overlay>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/workers" element={<Workers />} />
      </Routes>
    </Overlay>
    </div>
  )
}

export default App
