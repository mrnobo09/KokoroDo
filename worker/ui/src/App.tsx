import {Route,Routes} from 'react-router-dom';
import Home from './screens/Home';

function App() {
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Add more routes here as needed */}
      </Routes>
    </>
  )
}

export default App
