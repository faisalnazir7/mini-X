import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home/Home';
import Login from './Pages/Login/Login';
import Signup from './Pages/SignUp/SignUp';
// import UserProfile from './Pages/UserProfile/UserProfile';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* <Route path="/userprofile/:id" element={<UserProfile/>} /> */}
      </Routes>
  );
}

export default App;
