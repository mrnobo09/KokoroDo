import { Route,Routes } from "react-router-dom"
import Home from "./screens/Home"
import Overlay from "./components/Overlay" //Overlay for sidebar and other components if needed in the future

function App() {

  return (
    <>
    <Overlay>
      <Routes>
          <Route path="/" element={<Home />} />
      </Routes>
    </Overlay>
      
    </>
  )
}

export default App
