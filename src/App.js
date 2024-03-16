import './App.css';
import {Route,Routes} from "react-router-dom";
import Home from "./pages/Home";
import Navbar from './components/common/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import UpdatePassword from './pages/UpdatePassword';

function App() {
  return (
    <div className='w-screen min-h-screen bg-richblack-900 flex flex-col font-inter'>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/verify-email' element={<VerifyEmail/>}/>
        <Route path='/forgot-password' element={<ForgotPassword/>} />
        <Route path='/update-password/:id' element={<UpdatePassword/>} />
      </Routes>
    </div>
  );
}

export default App;
