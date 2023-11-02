import { Route, Routes } from "react-router-dom";
import Summary from './pages/summary';
import Live from './pages/live';
import Give from './pages/give';
import Grow from './pages/grow';
import Owe from './pages/owe';
import About from './pages/about';
import Expenses from './pages/expenses'
import LogSignin from './pages/login';
import Register from './pages/Register';
import ForgotPassword from './pages/forgotPassword';


function App() {
  
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<LogSignin />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path='/summary' element={<Summary />} />
        {/* <Route path='/live' element={<Live />} />
        <Route path='/give' element={<Give />} />
        <Route path='/grow' element={<Grow />} />
        <Route path='/owe' element={<Owe />} /> */}
        <Route path="/expenses" element={<Expenses />} />
        <Route path='/about' element={<About />} />
      </Routes>
    </div>
  );
}

export default App;