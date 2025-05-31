import 'bootstrap/dist/css/bootstrap.min.css';
import useAuthStore from "./store/Auth.store.jsx";
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from './Pages/Home.page.jsx';
import Login from './Pages/Login.page.jsx';
import SignUp from "./Pages/signUp.page.jsx";
import Interview from './Pages/Interview.page.jsx';
import InterviewDetails from './Pages/InterviewDetails.Page.jsx';
import Profile from './Pages/profile.page.jsx';

function App() {
  const { isAuthenticated, isLoading, fetchUser } = useAuthStore();

  useEffect(() => {
    const getData = async () => {
      await fetchUser();
    }
    getData();
  }, []);

  if (isLoading) {
    return (<p>Loading........</p>);
  }


  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
          <Route path='/login' element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
          <Route path='/signUp' element={!isAuthenticated ? <SignUp /> : <Navigate to="/" />} />
          <Route path='/interview/:id' element={isAuthenticated ?  <Interview /> : <Navigate to="/login" />} />
          <Route path='/interviewDetails/:id' element={isAuthenticated ?  <InterviewDetails /> : <Navigate to="/login" />} />
          <Route path='/profile' element={isAuthenticated ?  <Profile /> : <Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
