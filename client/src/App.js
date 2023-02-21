import "./App.css";
// eslint-disable-next-line no-unused-vars
import {BrowserRouter as Router, Routes, Route, BrowserRouter} from 'react-router-dom';
import NavBar from "./components/NavBar";
import DashBoard from "./pages/DashBoard";
import Register from "./pages/Register";
import Login from "./pages/Login";

function App() {
  return (
    <>
    <Router>
    <div className="container">
      <NavBar/>
      <Routes>
        <Route path='/' element={<DashBoard/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>
      </Routes>
    </div>
    </Router>
  </>
  );
}

export default App;
