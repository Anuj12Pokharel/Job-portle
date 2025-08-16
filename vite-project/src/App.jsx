import { Routes, Route } from 'react-router-dom'

import Home from './components/Home'
import Register from './Pages/Register';
import Login from './Pages/Login';




function App() {


  return <>

    <Routes>
      <Route path='/' element={<Home />}></Route>
       <Route path='/Register' element={<Register />}></Route>
              <Route path='/Login' element={<Login/>}></Route>
      
      
    </Routes>


  </>
}
export default App;