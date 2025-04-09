import Sidebar from "./Components/sidebar";
import Feed from "./Components/feed";
import Rightbar from "./Components/rightbar";
import Saved from "./Components/saved/save";
import {Routes,Route} from 'react-router-dom';
import './App.css';
import SignUp from "./Components/Authentication/signup";
import Login from "./Components/Authentication/login";
import ProfilePage from "./Components/profilePage";
function App() {
  return (
   <>
   <div className='newsContainer'>
   <Routes>
            <Route path='/' element={<Login/>}></Route>
            <Route path='/signup' element={<SignUp/>}></Route>
            <Route path='/home' element={<><Sidebar/><Feed/><Rightbar/></>}></Route>
            <Route path='/saved' element={<Saved/>}></Route>
            <Route path="/profile" element={<ProfilePage/>}></Route>
   </Routes>
        
        </div>
   </>
  );
}

export default App;
