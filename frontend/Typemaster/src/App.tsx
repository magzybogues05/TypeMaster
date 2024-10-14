import { Route, Routes } from 'react-router-dom'
import './App.css'
import Game from './screens/Game'
import Landing from './screens/Landing'
import Race from './screens/Race'

function App() {
  
  return (
    <Routes>
      <Route path='/' element={<Landing/>}/>
      <Route path='/race' element={<Race/>}/>
      <Route path='/game' element={<Game/>}/>
  </Routes>
  )
}

export default App
