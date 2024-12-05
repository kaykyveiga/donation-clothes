import {BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import Login from './components/pages/Auth/Login'
import Register from "./components/pages/Auth/Register"
import Home from "./components/Home.js"
function App() {
  return (
    <Router>
    <Routes>

      <Route path='/login' element={<Login />} />

      <Route path='/register' element={<Register />} />

      <Route path='/' element={<Home />} />

    </Routes>
</Router>
  );
}

export default App;
